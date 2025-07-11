const express = require('express');
const router = express.Router();

// Contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Maybe use a service like SendGrid, Mailgun, etc.
    
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString()
    });

    // For now, just return success
    res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;