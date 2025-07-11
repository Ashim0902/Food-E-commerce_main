import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Upload, Eye } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    img: '',
    ingredients: [],
    allergens: [],
    nutritionInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: ''
    },
    preparationTime: '',
    spiceLevel: 'Medium'
  });
  const [newIngredient, setNewIngredient] = useState('');
  const [newAllergen, setNewAllergen] = useState('');

  const categories = [
    'Staple Food', 'Snacks', 'Soups', 'Curries', 'Meat Dishes',
    'Festive Food', 'Desserts', 'Pickles', 'Side Dish', 'Breakfast',
    'Fast Food', 'Dairy', 'Beverages', 'Condiments'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await addProduct(formData);
      
      if (result.success) {
        // Show success toast
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 transition-all duration-300';
        toast.innerHTML = `
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span class="font-medium">Product added successfully! 🎉</span>
          </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.style.transform = 'translateX(100%)';
          toast.style.opacity = '0';
          setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);

        navigate('/admin/products');
      } else {
        alert(result.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('Add product error:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNutritionChange = (e) => {
    setFormData({
      ...formData,
      nutritionInfo: {
        ...formData.nutritionInfo,
        [e.target.name]: e.target.value
      }
    });
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, newIngredient.trim()]
      });
      setNewIngredient('');
    }
  };

  const removeIngredient = (index) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
  };

  const addAllergen = () => {
    if (newAllergen.trim()) {
      setFormData({
        ...formData,
        allergens: [...formData.allergens, newAllergen.trim()]
      });
      setNewAllergen('');
    }
  };

  const removeAllergen = (index) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.filter((_, i) => i !== index)
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
            <p className="text-gray-600 mt-1">Create a new menu item for your restaurant</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe your dish..."
                  required
                />
              </div>

              {/* Price and Category */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preparation Time and Spice Level */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preparation Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spice Level
                  </label>
                  <select
                    name="spiceLevel"
                    value={formData.spiceLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Mild">🌶️ Mild</option>
                    <option value="Medium">🌶️🌶️ Medium</option>
                    <option value="Hot">🌶️🌶️🌶️ Hot</option>
                    <option value="Very Hot">🌶️🌶️🌶️🌶️ Very Hot</option>
                  </select>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredients
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Add ingredient"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                  />
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-purple-500 hover:text-purple-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergens
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newAllergen}
                    onChange={(e) => setNewAllergen(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Add allergen (e.g., Nuts, Dairy)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                  />
                  <button
                    type="button"
                    onClick={addAllergen}
                    className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.allergens.map((allergen, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      ⚠️ {allergen}
                      <button
                        type="button"
                        onClick={() => removeAllergen(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Nutrition Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nutrition Information (per serving)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(formData.nutritionInfo).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-600 mb-1 capitalize">
                        {key} {key === 'calories' ? '(kcal)' : '(g)'}
                      </label>
                      <input
                        type="number"
                        name={key}
                        value={value}
                        onChange={handleNutritionChange}
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="img"
                  value={formData.img}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <p className="text-gray-500 text-sm mt-1">
                  Use high-quality images from Unsplash or similar services
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Preview</h3>
            </div>

            {/* Product Card Preview */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {formData.img ? (
                  <img
                    src={formData.img}
                    alt={formData.name || 'Product preview'}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <Upload className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-gray-800">
                      {formData.name || 'Product Name'}
                    </h4>
                    {formData.category && (
                      <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
                        {formData.category}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {formData.description || 'Product description will appear here...'}
                  </p>
                  
                  {/* Additional Info in Preview */}
                  <div className="space-y-2 mb-3">
                    {formData.preparationTime && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>⏱️ {formData.preparationTime} min</span>
                      </div>
                    )}
                    {formData.spiceLevel && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          formData.spiceLevel === 'Mild' ? 'bg-green-100 text-green-600' :
                          formData.spiceLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                          formData.spiceLevel === 'Hot' ? 'bg-orange-100 text-orange-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          🌶️ {formData.spiceLevel}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-600">
                      Rs. {formData.price || '0'}
                    </span>
                    <button className="bg-purple-500 text-white px-4 py-2 rounded-xl font-medium text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Tips for great products:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Use high-quality, appetizing images</li>
                <li>• Write descriptive, mouth-watering descriptions</li>
                <li>• Set competitive pricing</li>
                <li>• Choose the most appropriate category</li>
                <li>• Add detailed ingredients and allergen information</li>
                <li>• Include accurate nutrition information</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddProduct;