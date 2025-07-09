import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Utensils, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Show success toast
      const toast = document.createElement('div');
      toast.className =
        'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 transition-all duration-300';
      toast.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span class="font-medium">Welcome back! 🎉</span>
        </div>
      `;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);

      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <Utensils className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Sign in to your NepaliThali account</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" disabled={isLoading} />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-orange-600 hover:text-orange-700">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Social Login */}
        <button 
          className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Sign Up & Admin Login Links */}
        <div className="text-center text-gray-600 mt-6 space-y-2">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-600 hover:text-orange-700 font-semibold">
              Sign up
            </Link>
          </p>
          <p>
            Are you an admin?{' '}
            <Link to="/admin/login" className="text-red-600 hover:text-red-700 font-semibold">
              Admin Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;
