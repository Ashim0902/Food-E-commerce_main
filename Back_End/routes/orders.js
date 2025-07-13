const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Middleware to verify JWT and set req.user
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// Place a new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { customerInfo, items, subtotal, deliveryFee, serviceCharge, total } = req.body;

    if (!customerInfo || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required order information' });
    }

    // Generate unique order ID
    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    // Validate products exist
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ error: `Invalid product ID for ${item.name}` });
      }
      
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.name} not found` });
      }
    }

    const order = new Order({
      orderId,
      userId: new mongoose.Types.ObjectId(req.user.id),
      customerInfo,
      items: items.map(item => ({
        ...item,
        productId: new mongoose.Types.ObjectId(item.productId)
      })),
      subtotal,
      deliveryFee: deliveryFee || 50,
      serviceCharge,
      total,
      status: 'pending',
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's orders
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(req.user.id) })
      .populate('items.productId', 'name img category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ userId: new mongoose.Types.ObjectId(req.user.id) });

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single order
router.get('/:orderId', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderId: req.params.orderId,
      userId: new mongoose.Types.ObjectId(req.user.id) 
    }).populate('items.productId', 'name img category');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Get all orders
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, isAccepted } = req.query;
    const query = {};

    if (status) query.status = status;
    if (isAccepted !== undefined) query.isAccepted = isAccepted === 'true';

    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name img category')
      .populate('acceptedBy', 'email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Accept order
router.put('/admin/:orderId/accept', adminAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.isAccepted) {
      return res.status(400).json({ error: 'Order already accepted' });
    }

    order.isAccepted = true;
    order.acceptedAt = new Date();
    order.acceptedBy = new mongoose.Types.ObjectId(req.admin._id);
    order.status = 'confirmed';
    
    await order.save();

    res.json({
      success: true,
      message: 'Order accepted successfully',
      order
    });
  } catch (error) {
    console.error('Accept order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Update order status
router.put('/admin/:orderId/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    
    if (status === 'delivered') {
      order.actualDelivery = new Date();
    }
    
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Get order statistics
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const acceptedOrders = await Order.countDocuments({ isAccepted: true });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      pendingOrders,
      acceptedOrders,
      deliveredOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;