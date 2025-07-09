import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, Utensils, LogOut, ChevronDown, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';

const getUserInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const navigate = useNavigate();
  const { state } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { admin, isAuthenticated: isAdminAuthenticated } = useAdmin();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Order', path: '/order' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-orange-100 w-full">
      <div className="flex items-center justify-between w-full px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <Utensils className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              NepaliThali
            </span>
            <span className="text-xs text-gray-500 -mt-1 hidden sm:block">Authentic & Fresh</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="relative text-gray-700 hover:text-orange-600 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-orange-50 group"
            >
              {item.name}
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-8 group-hover:-translate-x-1/2 transition-all duration-300 ease-in-out"></span>
            </Link>
          ))}
        </div>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search delicious food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 xl:w-80 pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 hover:bg-white transition-all text-base"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-x-4 relative">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition"
          >
            <ShoppingCart className="w-6 h-6" />
            {state.itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg"
              >
                {state.itemCount}
              </motion.span>
            )}
          </Link>

          {/* Desktop Auth / User Menu */}
          <div className="hidden md:flex items-center gap-2 relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-orange-100 transition ${
                isAdminAuthenticated ? 'bg-purple-50 border-2 border-purple-200' : 'bg-orange-50'
              }`}
            >
              {isAuthenticated || isAdminAuthenticated ? (
                <>
                  <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold ${
                    isAdminAuthenticated 
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600' 
                      : 'bg-gradient-to-br from-orange-500 to-red-500'
                  }`}>
                    {isAdminAuthenticated ? 'A' : getUserInitials(user?.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {isAdminAuthenticated ? 'Admin' : user?.name}
                    </span>
                    {isAdminAuthenticated && (
                      <span className="text-xs text-purple-600 font-semibold">Admin Panel</span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Account</span>
                </>
              )}
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg w-48 py-2 z-50">
                {isAuthenticated || isAdminAuthenticated ? (
                  <>
                    {isAdminAuthenticated ? (
                      <>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 font-medium"
                        >
                          <User className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                        <Link
                          to="/admin/products"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                        >
                          <User className="w-4 h-4" />
                          Manage Products
                        </Link>
                        <Link
                          to="/admin/products/add"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                        >
                          <User className="w-4 h-4" />
                          Add Product
                        </Link>
                        <hr className="my-1 border-gray-200" />
                      </>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                        >
                          <User className="w-4 h-4" />
                          Settings
                        </Link>
                        <hr className="my-1 border-gray-200" />
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 font-medium"
                    >
                      <UserPlus className="w-4 h-4" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition ${
              isAdminAuthenticated ? 'ring-2 ring-purple-200' : ''
            }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search delicious food..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </form>

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-orange-600 px-4 py-3 rounded-xl text-base font-medium transition hover:bg-orange-50"
                >
                  {item.name}
                </Link>
              ))}

              {isAuthenticated || isAdminAuthenticated ? (
                <>
                  <div className={`text-gray-700 px-4 py-3 rounded-xl flex items-center gap-2 ${
                    isAdminAuthenticated ? 'bg-purple-50 border border-purple-200' : 'bg-orange-50'
                  }`}>
                    <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-semibold ${
                      isAdminAuthenticated 
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600' 
                        : 'bg-gradient-to-br from-orange-500 to-red-500'
                    }`}>
                      {isAdminAuthenticated ? 'A' : getUserInitials(user?.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        Hi, {isAdminAuthenticated ? 'Admin' : user?.name}
                      </span>
                      {isAdminAuthenticated && (
                        <span className="text-xs text-purple-600 font-semibold">Admin Panel Access</span>
                      )}
                    </div>
                  </div>
                  
                  {isAdminAuthenticated && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-purple-700 hover:text-purple-800 px-4 py-3 rounded-xl text-base font-medium transition hover:bg-purple-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/admin/products"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-purple-700 hover:text-purple-800 px-4 py-3 rounded-xl text-base font-medium transition hover:bg-purple-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Manage Products
                      </Link>
                    </>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="text-red-600 px-4 py-3 rounded-xl text-base font-medium transition hover:bg-red-50 w-full text-left flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:text-orange-600 px-4 py-3 rounded-xl text-base font-medium transition hover:bg-orange-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-3 rounded-xl text-base font-medium transition flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Nav;