import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Package, 
  ShoppingCart,
  Brain,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  // Mock data for charts
  const salesData = [
    { name: 'Jan', sales: 4000, revenue: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398 },
    { name: 'Mar', sales: 2000, revenue: 9800 },
    { name: 'Apr', sales: 2780, revenue: 3908 },
    { name: 'May', sales: 1890, revenue: 4800 },
    { name: 'Jun', sales: 2390, revenue: 3800 },
  ];

  const customerData = [
    { name: 'New', value: 400, color: '#3B82F6' },
    { name: 'Returning', value: 300, color: '#10B981' },
    { name: 'Inactive', value: 200, color: '#F59E0B' },
  ];

  const topProducts = [
    { name: 'Laptop Pro', sales: 45, revenue: 22500 },
    { name: 'Smartphone X', sales: 38, revenue: 19000 },
    { name: 'Tablet Air', sales: 32, revenue: 16000 },
    { name: 'Headphones', sales: 28, revenue: 14000 },
  ];

  const aiInsights = [
    {
      type: 'positive',
      title: 'Sales Growth Trend',
      description: 'Your sales have increased by 15% this month. This trend is expected to continue based on current market analysis.',
      icon: TrendingUp,
    },
    {
      type: 'warning',
      title: 'Inventory Alert',
      description: '5 products are running low on stock. Consider restocking to avoid potential stockouts.',
      icon: AlertTriangle,
    },
    {
      type: 'positive',
      title: 'Customer Satisfaction',
      description: 'Customer satisfaction scores improved by 8% this quarter. Your service quality is trending upward.',
      icon: CheckCircle,
    },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '₹124,500',
      change: '+15.3%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Total Sales',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingCart,
    },
    {
      title: 'Active Customers',
      value: '892',
      change: '+12.1%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Inventory Items',
      value: '156',
      change: '-2.4%',
      changeType: 'negative',
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-primary-50 to-blue-50 px-4 py-2 rounded-lg">
          <Brain className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">AI-Powered Insights</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales & Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Customer Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {customerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {customerData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Insights and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          </div>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <Icon className={`w-5 h-5 mt-0.5 ${
                    insight.type === 'positive' ? 'text-green-500' : 'text-yellow-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 