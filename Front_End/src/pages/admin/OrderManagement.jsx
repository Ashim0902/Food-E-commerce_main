import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Search, 
  Filter, 
  Eye,
  Check,
  X,
  Clock,
  Truck,
  CheckCircle,
  User,
  Phone,
  MapPin,
  Mail,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';

const OrderManagement = () => {
  const { getOrders, acceptOrder, updateOrderStatus } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAccepted, setSelectedAccepted] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const statuses = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'on_the_way', label: 'On the Way' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, selectedStatus, selectedAccepted, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const filters = {
        page: currentPage,
        limit: 20
      };
      
      if (selectedStatus !== 'all') filters.status = selectedStatus;
      if (selectedAccepted !== 'all') filters.isAccepted = selectedAccepted;

      const data = await getOrders(filters);
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await acceptOrder(orderId);
      fetchOrders();
      
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 transition-all duration-300';
      toast.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span class="font-medium">Order accepted successfully!</span>
        </div>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    } catch (error) {
      console.error('Failed to accept order:', error);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders();
      
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 transition-all duration-300';
      toast.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span class="font-medium">Order status updated successfully!</span>
        </div>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'on_the_way': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'preparing': return <Package className="w-4 h-4" />;
      case 'on_the_way': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Check className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
            <p className="text-gray-600 mt-1">Manage customer orders and track deliveries</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by customer name or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Accepted Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedAccepted}
                onChange={(e) => setSelectedAccepted(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="all">All Orders</option>
                <option value="true">Accepted</option>
                <option value="false">Pending Acceptance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accepted</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order, index) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">#{order.orderId}</div>
                            <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                              {order.userId?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.customerInfo.name}</div>
                              <div className="text-sm text-gray-500">{order.customerInfo.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Rs. {order.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.isAccepted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {order.isAccepted ? (
                              <>
                                <Check className="w-3 h-3 mr-1" />
                                Accepted
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {!order.isAccepted && (
                              <button
                                onClick={() => handleAcceptOrder(order.orderId)}
                                className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Order Detail Modal */}
        <AnimatePresence>
          {showOrderModal && selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
              onClick={() => setShowOrderModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                  <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Order Info */}
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Order Information</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order ID:</span>
                            <span className="font-semibold">#{selectedOrder.orderId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-semibold">{formatDate(selectedOrder.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                              {getStatusIcon(selectedOrder.status)}
                              <span className="ml-1 capitalize">{selectedOrder.status.replace('_', ' ')}</span>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Accepted:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              selectedOrder.isAccepted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {selectedOrder.isAccepted ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment:</span>
                            <span className="font-semibold capitalize">{selectedOrder.customerInfo.paymentMethod}</span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="bg-blue-50 rounded-2xl p-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Customer Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold">{selectedOrder.customerInfo.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <span>{selectedOrder.customerInfo.email}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <span>{selectedOrder.customerInfo.phone}</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                            <span>{selectedOrder.customerInfo.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="space-y-3">
                        {!selectedOrder.isAccepted && (
                          <button
                            onClick={() => {
                              handleAcceptOrder(selectedOrder.orderId);
                              setShowOrderModal(false);
                            }}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <Check className="w-5 h-5" />
                            Accept Order
                          </button>
                        )}
                        
                        <div className="grid grid-cols-2 gap-3">
                          {['confirmed', 'preparing', 'on_the_way', 'delivered'].map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                handleUpdateStatus(selectedOrder.orderId, status);
                                setShowOrderModal(false);
                              }}
                              disabled={selectedOrder.status === status}
                              className={`py-2 px-4 rounded-xl font-medium transition-colors text-sm ${
                                selectedOrder.status === status
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-purple-500 hover:bg-purple-600 text-white'
                              }`}
                            >
                              {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Order Items & Summary */}
                    <div className="space-y-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Order Items</h4>
                        <div className="space-y-4">
                          {selectedOrder.items.map((item) => (
                            <div key={item._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                              <img
                                src={item.img}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-800">{item.name}</h5>
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

                      {/* Order Summary */}
                      <div className="bg-orange-50 rounded-2xl p-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-semibold">Rs. {selectedOrder.subtotal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee:</span>
                            <span className="font-semibold">Rs. {selectedOrder.deliveryFee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Service Charge:</span>
                            <span className="font-semibold">Rs. {selectedOrder.serviceCharge}</span>
                          </div>
                          <hr className="border-gray-300" />
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-orange-600">Rs. {selectedOrder.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default OrderManagement;