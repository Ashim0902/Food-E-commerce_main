import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Star,
  Package,
  Heart,
  Award,
  Clock,
  Utensils
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Profile = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { state } = useCart();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    if (user) {
      setEditData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      bio: user.bio || ''
    });
  };

  const handleSave = () => {
    // Update user data (in a real app, this would make an API call)
    updateUser && updateUser(editData);
    setIsEditing(false);
    
    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 transition-all duration-300';
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span class="font-medium">Profile updated successfully! ✨</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = [
    { icon: Package, label: 'Total Orders', value: state.orders.length, color: 'text-blue-600 bg-blue-100' },
    { icon: Heart, label: 'Favorite Dishes', value: '12', color: 'text-red-600 bg-red-100' },
    { icon: Star, label: 'Reviews Given', value: '8', color: 'text-yellow-600 bg-yellow-100' },
    { icon: Award, label: 'Loyalty Points', value: '2,450', color: 'text-purple-600 bg-purple-100' }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black text-gray-800 mb-4">
            My <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="text-gray-600 text-lg">Manage your account and preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center">
              {/* Profile Picture */}
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-2xl">
                  {getUserInitials(user?.name)}
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">{user?.name}</h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              
              <div className="flex items-center justify-center gap-2 text-orange-600 mb-6">
                <Utensils className="w-5 h-5" />
                <span className="font-medium">Food Enthusiast</span>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Member Since</span>
                </div>
                <p className="text-gray-700 font-medium">January 2024</p>
              </div>

              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Profile Details & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Profile Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-800">Profile Information</h3>
                {isEditing && (
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                    Editing Mode
                  </span>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">{user?.name || 'Not provided'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">{user?.email || 'Not provided'}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+977 98-12345678"
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">{user?.phone || 'Not provided'}</p>
                  )}
                </div>

                {/* Join Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Member Since
                  </label>
                  <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">January 15, 2024</p>
                </div>
              </div>

              {/* Address */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={editData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Enter your address in Pokhara..."
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">{user?.address || 'Not provided'}</p>
                )}
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Me
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself and your food preferences..."
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">
                    {user?.bio || 'Food lover exploring the authentic flavors of Nepal! 🍛'}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  to="/order"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-2xl transition-all duration-300 group"
                >
                  <Package className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-gray-800">View Orders</p>
                    <p className="text-gray-600 text-sm">Track your recent orders</p>
                  </div>
                </Link>
                
                <Link
                  to="/settings"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-2xl transition-all duration-300 group"
                >
                  <User className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-gray-800">Account Settings</p>
                    <p className="text-gray-600 text-sm">Manage preferences</p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;