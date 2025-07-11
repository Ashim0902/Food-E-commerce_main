const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Staple Food',
      'Snacks', 
      'Soups',
      'Curries',
      'Meat Dishes',
      'Festive Food',
      'Desserts',
      'Pickles',
      'Side Dish',
      'Breakfast',
      'Fast Food',
      'Dairy',
      'Beverages',
      'Condiments'
    ]
  },
  img: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    trim: true
  }],
  nutritionInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    fiber: { type: Number, min: 0 }
  },
  preparationTime: {
    type: Number, // in minutes
    min: 0
  },
  spiceLevel: {
    type: String,
    enum: ['Mild', 'Medium', 'Hot', 'Very Hot'],
    default: 'Medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);