import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Package,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Sales: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock sales data
  const salesData = [
    { month: 'Jan', sales: 12000, orders: 45, customers: 38 },
    { month: 'Feb', sales: 15000, orders: 52, customers: 42 },
    { month: 'Mar', sales: 18000, orders: 61, customers: 48 },
    { month: 'Apr', sales: 22000, orders: 73, customers: 55 },
    { month: 'May', sales: 25000, orders: 82, customers: 62 },
    { month: 'Jun', sales: 28000, orders: 91, customers: 68 },
  ];

  const orderData = [
    { id: '#ORD-001', customer: 'John Smith', amount: 299.99, status: 'completed', date: '2024-01-15', items: 3 },
    { id: '#ORD-002', customer: 'Sarah Johnson', amount: 149.50, status: 'pending', date: '2024-01-16', items: 2 },
    { id: '#ORD-003', customer: 'Mike Wilson', amount: 599.99, status: 'processing', date: '2024-01-17', items: 1 },
    { id: '#ORD-004', customer: 'Emily Davis', amount: 89.99, status: 'completed', date: '2024-01-18', items: 4 },
    { id: '#ORD-005', customer: 'David Brown', amount: 199.99, status: 'cancelled', date: '2024-01-19', items: 2 },
    { id: '#ORD-006', customer: 'Lisa Anderson', amount: 399.99, status: 'completed', date: '2024-01-20', items: 1 },
  ];

  const productSalesData = [
    { name: 'Product A', sales: 35, revenue: 8750 },
    { name: 'Product B', sales: 28, revenue: 7000 },
    { name: 'Product C', sales: 22, revenue: 5500 },
    { name: 'Product D', sales: 18, revenue: 4500 },
    { name: 'Product E', sales: 15, revenue: 3750 },
  ];

  const paymentMethodData = [
    { name: 'Credit Card', value: 45, color: '#3B82F6' },
    { name: 'PayPal', value: 30, color: '#10B981' },
    { name: 'Bank Transfer', value: 15, color: '#F59E0B' },
    { name: 'Cash', value: 10, color: '#EF4444' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orderData.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600 mt-1">Track orders, monitor revenue, and analyze sales performance</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Order
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$127,500</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                +12.5% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">404</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                +8.2% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">$315.59</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                +3.8% from last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">4.2%</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                +0.8% from last month
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Product Sales */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Payment Methods */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Distribution</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="50%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            AI Sales Insights
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Peak Sales Time</p>
                <p className="text-sm text-gray-600">Weekends between 2-6 PM show 40% higher conversion rates</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Customer Segment</p>
                <p className="text-sm text-gray-600">Premium customers (25-35 age group) have 3x higher AOV</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Product Recommendation</p>
                <p className="text-sm text-gray-600">Bundle Product A + Product C increases revenue by 25%</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="card p-6 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            AI Alerts & Recommendations
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">High Cart Abandonment</p>
                <p className="text-sm text-gray-600">68% of mobile users abandon carts - optimize checkout flow</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Seasonal Opportunity</p>
                <p className="text-sm text-gray-600">Prepare for Q2 peak - stock up on trending products</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Loyalty Program</p>
                <p className="text-sm text-gray-600">Implement rewards system to increase repeat purchases</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Orders Table */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="card p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                  <td className="py-3 px-4 text-gray-700">{order.customer}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">${order.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{order.date}</td>
                  <td className="py-3 px-4 text-gray-700">{order.items}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sales; 