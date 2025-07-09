import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  TrendingUp, 
  Eye,
  EyeOff,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { getDashboardStats } = useAdmin();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Products',
      value: stats?.activeProducts || 0,
      icon: Eye,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Inactive Products',
      value: stats?.inactiveProducts || 0,
      icon: EyeOff,
      color: 'bg-red-500',
      change: '-3%'
    },
    {
      title: 'Categories',
      value: stats?.categoryStats?.length || 0,
      icon: BarChart3,
      color: 'bg-purple-500',
      change: '+2%'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your restaurant.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/products/add')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className="text-green-600 text-sm font-medium mt-2">{stat.change} from last month</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Category Distribution</h3>
            </div>
            <div className="space-y-4">
              {stats?.categoryStats?.slice(0, 5).map((category, index) => (
                <div key={category._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
                    ></div>
                    <span className="text-gray-700 font-medium">{category._id}</span>
                  </div>
                  <span className="text-gray-600 font-semibold">{category.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Recent Products</h3>
            </div>
            <div className="space-y-4">
              {stats?.recentProducts?.map((product) => (
                <div key={product._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">{product.name}</h4>
                    <p className="text-gray-600 text-xs">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">Rs. {product.price}</p>
                    <p className={`text-xs ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/products/add')}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-300 group"
            >
              <Plus className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="font-semibold text-gray-800">Add New Product</p>
                <p className="text-gray-600 text-sm">Create a new menu item</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/products')}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-300 group"
            >
              <Package className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="font-semibold text-gray-800">Manage Products</p>
                <p className="text-gray-600 text-sm">Edit existing items</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-300 group"
            >
              <TrendingUp className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="font-semibold text-gray-800">View Website</p>
                <p className="text-gray-600 text-sm">See customer view</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
