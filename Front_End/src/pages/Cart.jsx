import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag, User, MapPin, Phone, Mail, CreditCard, Banknote, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { state, dispatch } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    // Pre-fill customer info if user is logged in
    if (user) {
      setCustomerInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [isAuthenticated, user, navigate]);

  const updateQuantity = (id, newQuantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    const orderData = {
      customerInfo: {
        ...customerInfo,
        paymentMethod
      }
    };
    
    dispatch({ 
      type: 'PLACE_ORDER', 
      payload: orderData
    });
    
    // Show success message
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-3 rounded-xl shadow-2xl z-50 transition-all duration-300 max-w-xs sm:max-w-sm';
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span class="font-medium text-sm sm:text-base">Order placed successfully! 🎉</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);

    // Reset form and navigate to orders
    setCustomerInfo({ name: '', email: '', phone: '', address: '' });
    setShowCheckout(false);
    navigate('/order');
  };

  const handleNavClick = () => {
    window.scrollTo(0, 0);
  };

  // Show login required if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 sm:p-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl mb-8"
            >
              <Lock className="w-16 h-16 sm:w-24 sm:h-24 text-orange-500 mx-auto" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 text-base sm:text-lg mb-8 sm:mb-12">Please sign in to view your cart and place orders.</p>
            <Link
              to="/signin"
              onClick={handleNavClick}
              className="inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-base sm:text-lg"
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
              Sign In
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const deliveryFee = 50;
  const serviceCharge = Math.round(state.total * 0.1);
  const finalTotal = state.total + deliveryFee + serviceCharge;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 sm:p-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl mb-8"
            >
              🛒
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 text-base sm:text-lg mb-8 sm:mb-12">Discover amazing Nepali dishes and start your culinary journey!</p>
            <Link
              to="/menu"
              onClick={handleNavClick}
              className="inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-base sm:text-lg"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              Browse Menu
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-gray-800 mb-4">
            Your <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Cart</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            {state.itemCount} {state.itemCount === 1 ? 'delicious item' : 'delicious items'} ready for checkout
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Cart Items</h2>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <AnimatePresence>
                  {state.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-xl shadow-md"
                      />
                      
                      <div className="flex-1 min-w-0 w-full">
                        <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-1 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl sm:text-2xl font-bold text-orange-600">Rs. {item.price}</span>
                          {item.category && (
                            <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                              {item.category}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                          </button>
                          
                          <span className="w-8 sm:w-12 text-center font-bold text-base sm:text-lg">{item.quantity}</span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 p-2 sm:p-3 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 sticky top-4"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">Order Summary</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm sm:text-base">Subtotal ({state.itemCount} items)</span>
                  <span className="font-semibold text-base sm:text-lg">Rs. {state.total}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm sm:text-base">Delivery Fee</span>
                  <span className="font-semibold text-base sm:text-lg">Rs. {deliveryFee}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm sm:text-base">Service Charge</span>
                  <span className="font-semibold text-base sm:text-lg">Rs. {serviceCharge}</span>
                </div>
                <hr className="my-4 border-gray-200" />
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg sm:text-xl font-bold text-gray-800">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-600">Rs. {finalTotal}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-3 sm:p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <div className="ml-3 flex items-center gap-2 sm:gap-3">
                      <Banknote className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">Cash on Delivery</p>
                        <p className="text-xs sm:text-sm text-gray-600">Pay when your order arrives</p>
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 sm:p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <div className="ml-3 flex items-center gap-2 sm:gap-3">
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">Online Payment</p>
                        <p className="text-xs sm:text-sm text-gray-600">Pay securely online</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={() => setShowCheckout(!showCheckout)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 sm:py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 text-base sm:text-lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <Link
                  to="/menu"
                  onClick={handleNavClick}
                  className="w-full border-2 border-orange-500 text-orange-600 py-3 sm:py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-orange-50 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  Continue Shopping
                </Link>
              </div>

              {/* Payment Method Display */}
              <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 mt-4">
                <h4 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">Selected Payment Method</h4>
                <div className="flex items-center gap-2 sm:gap-3">
                  {paymentMethod === 'cod' ? (
                    <>
                      <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <span className="text-gray-700 text-sm sm:text-base">Cash on Delivery</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <span className="text-gray-700 text-sm sm:text-base">Online Payment</span>
                    </>
                  )}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-green-50 rounded-2xl border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-sm sm:text-base">Free delivery on orders above Rs. 500</span>
                </div>
                <p className="text-green-600 text-xs sm:text-sm mt-1">Estimated delivery: 25-30 minutes in Pokhara</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Checkout Form Modal */}
        <AnimatePresence>
          {showCheckout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
              onClick={() => setShowCheckout(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Complete Your Order</h3>
                
                <form onSubmit={handlePlaceOrder} className="space-y-4 sm:space-y-6">
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Delivery Address in Pokhara
                    </label>
                    <textarea
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm sm:text-base"
                      placeholder="Enter your address in Pokhara..."
                      required
                    />
                  </div>
                  
                  <div className="bg-orange-50 rounded-2xl p-4 sm:p-6">
                    <h4 className="font-bold text-gray-800 mb-4 text-sm sm:text-base">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>Rs. {state.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>Rs. {deliveryFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Charge:</span>
                        <span>Rs. {serviceCharge}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-bold text-base sm:text-lg">
                        <span>Total:</span>
                        <span className="text-orange-600">Rs. {finalTotal}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-2 sm:py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      {paymentMethod === 'cod' ? 'Place Order' : 'Pay & Order'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Cart;