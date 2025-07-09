const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Get all active products for frontend
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 50 } = req.query;
    const query = { isActive: true };

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Build sort object
    let sortObj = { createdAt: -1 }; // Default sort by newest
    if (sort === 'price_asc') {
      sortObj = { price: 1 };
    } else if (sort === 'price_desc') {
      sortObj = { price: -1 };
    } else if (sort === 'name_asc') {
      sortObj = { name: 1 };
    } else if (sort === 'name_desc') {
      sortObj = { name: -1 };
    }

    const products = await Product.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    // Get unique categories for filtering
    const categories = await Product.distinct('category', { isActive: true });

    res.json({
      products,
      categories,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;