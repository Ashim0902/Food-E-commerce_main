import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  ShoppingBag,
  ArrowRight,
  Star,
  RefreshCw,
  CreditCard,
  Banknote,
  User,
  Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Order = () => {
  const { state, dispatch } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleNavClick = () => {
    window.scrollTo(0, 0);
  };

  // Simulate order status updates
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      state.orders.forEach(order => {
        if (order.status === 'confirmed') {
          setTimeout(() => {
            dispatch({ 
              type: 'UPDATE_ORDER_STATUS', 
              payload: { orderId: order.id, status: 'preparing' }
            });
          }, 5000);
        } else if (order.status === 'preparing') {
          setTimeout(() => {
            dispatch({ 
              type: 'UPDATE_ORDER_STATUS', 
              payload: { orderId: order.id, status: 'on_the_way' }
            });
          }, 10000);
        } else if (order.status === 'on_the_way') {
          setTimeout(() => {
            dispatch({ 
              type: 'UPDATE_ORDER_STATUS', 
              payload: { orderId: order.id, status: 'delivered' }
            });
          }, 15000);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.orders, dispatch, isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'preparing': return 'text-orange-600 bg-orange-100';
      case 'on_the_way': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-5 h-5" />;
      case 'preparing': return <RefreshCw className="w-5 h-5 animate-spin" />;
      case 'on_the_way': return <Truck className="w-5 h-5" />;
      case 'delivered': return <Package className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Order Confirmed';
      case 'preparing': return 'Preparing Your Food';
      case 'on_the_way': return 'On The Way';
      case 'delivered': return 'Delivered';
      default: return 'Processing';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDeliveryTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show login required if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl mb-8"
            >
              <Lock className="w-24 h-24 text-orange-500 mx-auto" />
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 text-lg mb-12">Please sign in to view your orders and track deliveries.</p>
            <Link
              to="/signin"
              onClick={handleNavClick}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
            >
              <User className="w-6 h-6" />
              Sign In
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (state.orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl mb-8"
            >
              📦
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 text-lg mb-12">Start your authentic Nepali culinary journey by placing your first order!</p>
            <Link
              to="/menu"
              onClick={handleNavClick}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
            >
              <ShoppingBag className="w-6 h-6" />
              Browse Menu
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black text-gray-800 mb-4">
            Your <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Orders</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Track your delicious Nepali orders and enjoy your meals!
          </p>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {state.orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Order Info */}
                <div className="lg:col-span-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Order #{order.id.slice(-6)}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-600 mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(order.orderDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>ETA: {formatDeliveryTime(order.estimatedDelivery)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.paymentMethod === 'cod' ? (
                          <>
                            <Banknote className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-600">Cash on Delivery</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-600">Online Payment</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)} mt-4 md:mt-0`}>
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 text-lg">Order Items:</h4>
                    <div className="grid gap-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-xl"
                          />
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800">{item.name}</h5>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-orange-600 font-bold">Rs. {item.price}</span>
                              <span className="text-gray-500">× {item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">Rs. {item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary & Customer Info */}
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">Rs. {order.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-semibold">Rs. {order.deliveryFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Charge</span>
                        <span className="font-semibold">Rs. {order.serviceCharge}</span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-orange-600">Rs. {order.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  {order.customerInfo && (
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="font-bold text-gray-800 mb-4 text-lg">Delivery Details</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-orange-500" />
                          <div>
                            <p className="font-semibold">{order.customerInfo.name}</p>
                            <p className="text-gray-600 text-sm">{order.customerInfo.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-orange-500" />
                          <span className="text-gray-600">{order.customerInfo.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-orange-500" />
                          <span className="text-gray-600">{order.customerInfo.email}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rating Section for Delivered Orders */}
                  {order.status === 'delivered' && (
                    <div className="bg-green-50 rounded-2xl p-6">
                      <h4 className="font-bold text-gray-800 mb-4">Rate Your Experience</h4>
                      <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-6 h-6 text-yellow-500 fill-current cursor-pointer hover:scale-110 transition-transform" />
                        ))}
                      </div>
                      <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors">
                        Submit Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/menu"
            onClick={handleNavClick}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            Order More Delicious Food
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Order;