const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Admin = require('./models/Admin');

// Import routes
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const reviewRoutes = require('./routes/reviews');
const contactRoutes = require('./routes/contact');
const orderRoutes = require('./routes/orders');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your_jwt_secret_here'; // change to env var in production

mongoose.connect('mongodb://localhost:27017/nepaliThali')
.then(() => console.log('MongoDB connected'))
.catch(console.error);

// Import User model
const User = require('./models/User');

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);

// Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ name, email, passwordHash });
    await user.save();

    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user: { name: user.name, email: user.email, id: user._id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user: { name: user.name, email: user.email, id: user._id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to verify JWT and set req.user
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// Protected route example (get current user)
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.put('/api/me', authMiddleware, async (req, res) => {
  try {
    const { name, phone, address, bio, preferences } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (address !== undefined) updateData.address = address.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (preferences !== undefined) updateData.preferences = preferences;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
app.put('/api/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.passwordHash = newPasswordHash;
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Admin Panel: http://localhost:5173/admin/login');
  console.log('Admin Login: admin@gmail.com / admin123');
  
  // Create default admin if it doesn't exist
  createDefaultAdmin();
});

// Function to create default admin
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
    
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      const admin = new Admin({
        email: 'admin@gmail.com',
        passwordHash,
        role: 'super_admin'
      });

      await admin.save();
      console.log('✅ Default admin created: admin@gmail.com / admin123');
    } else {
      console.log('✅ Default admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
};