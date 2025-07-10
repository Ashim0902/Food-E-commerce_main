const mongoose = require('mongoose');
const Product = require('../models/Product');
const { foodItems } = require('../../Front_End/src/data/foodItems');

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/nepaliThali');

    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Transform and insert food items
    const products = foodItems.map(item => ({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category || 'Uncategorized',
      img: item.img,
      isActive: true
    }));

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();