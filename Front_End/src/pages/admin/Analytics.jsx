import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  Clock
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';

// Dummy chart component placeholder (replace with real charts later)
const ChartPlaceholder = ({ title }) => (
  <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 text-lg font-semibold">
    {title} Chart Here
  </div>
);

const Analytics = () => {
  const { getAnalyticsData } = useAdmin();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getAnalyticsData();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [getAnalyticsData]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600 mt-1">Overview of your restaurant's performance.</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 flex flex-col items-center"
          >
            <DollarSign className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-3xl font-bold text-gray-800">Rs. {data?.totalRevenue || 0}</p>
            <p className="text-gray-600 mt-1 text-sm">Total Revenue</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 flex flex-col items-center"
          >
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-3xl font-bold text-gray-800">{data?.totalCustomers || 0}</p>
            <p className="text-gray-600 mt-1 text-sm">Total Customers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 flex flex-col items-center"
          >
            <Package className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-3xl font-bold text-gray-800">{data?.totalOrders || 0}</p>
            <p className="text-gray-600 mt-1 text-sm">Total Orders</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 flex flex-col items-center"
          >
            <TrendingUp className="w-8 h-8 text-indigo-600 mb-2" />
            <p className="text-3xl font-bold text-gray-800">{data?.monthlyGrowth || 0}%</p>
            <p className="text-gray-600 mt-1 text-sm">Monthly Growth</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 flex flex-col items-center"
          >
            <Clock className="w-8 h-8 text-yellow-600 mb-2" />
            <p className="text-3xl font-bold text-gray-800">{data?.avgDeliveryTime || 0} mins</p>
            <p className="text-gray-600 mt-1 text-sm">Avg Delivery Time</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 flex flex-col items-center"
          >
            <Activity className="w-8 h-8 text-red-600 mb-2" />
            <p className="text-3xl font-bold text-gray-800">{data?.activeProducts || 0}</p>
            <p className="text-gray-600 mt-1 text-sm">Active Products</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Sales by Category</h3>
            </div>
            <ChartPlaceholder title="Sales by Category" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Order Status Distribution</h3>
            </div>
            <ChartPlaceholder title="Order Status" />
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
