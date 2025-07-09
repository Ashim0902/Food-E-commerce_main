import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Star, X, User, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const FoodCard = ({ 
  item, 
  index = 0, 
  onClick, 
  showAddToCart = true 
}) => {
  const { dispatch } = useCart();
  const { isAuthenticated } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    // Create a cart item with the correct id field
    const cartItem = {
      ...item,
      id: item._id || item.id // Ensure we have an id field for cart operations
    };
    
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    
    // Success toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-3 rounded-xl shadow-2xl z-50 transition-all duration-300 transform translate-x-0 max-w-xs sm:max-w-sm';
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span class="font-medium text-sm sm:text-base">${item.name} added to cart!</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2500);
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className="group w-full max-w-[280px] sm:max-w-[320px] mx-auto rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-gray-100"
        onClick={onClick}
      >
        <div className="relative overflow-hidden">
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-44 sm:h-52 object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {item.category && (
            <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-semibold shadow-lg">
              {item.category}
            </span>
          )}
          
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs font-medium text-gray-700">4.5</span>
          </div>
        </div>
        
        <div className="p-4 sm:p-5">
          <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-orange-600">
                Rs. {item.price}
              </span>
              <span className="text-xs text-gray-500">Free delivery</span>
            </div>
            
            {showAddToCart && (
              <motion.button
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                Add
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Login Required Popup */}
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={closeLoginPopup}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative"
            >
              <button
                onClick={closeLoginPopup}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
                  <ShoppingCart className="text-white w-8 h-8" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Login Required</h3>
                <p className="text-gray-600 mb-2 text-sm sm:text-base">
                  Please sign in to add <span className="font-semibold text-orange-600">{item.name}</span> to your cart
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mb-8">
                  Join thousands of food lovers enjoying authentic Nepali cuisine!
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <Link
                    to="/signin"
                    onClick={closeLoginPopup}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    Sign In
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Don't have an account?{' '}
                    <Link 
                      to="/signup" 
                      onClick={closeLoginPopup}
                      className="text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FoodCard;