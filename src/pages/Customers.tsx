import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Star,
  Crown,
  UserPlus,
  TrendingUp,
  Brain,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  totalSpent: number;
  orders: number;
  lastOrder: string;
  status: 'active' | 'inactive' | 'vip';
  segment: 'new' | 'returning' | 'vip' | 'at-risk';
}

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock customer data
  const customers: Customer[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      joinDate: '2023-01-15',
      totalSpent: 2840.50,
      orders: 12,
      lastOrder: '2024-01-10',
      status: 'vip',
      segment: 'vip',
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      joinDate: '2023-03-22',
      totalSpent: 1560.75,
      orders: 8,
      lastOrder: '2024-01-08',
      status: 'active',
      segment: 'returning',
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 345-6789',
      location: 'Miami, FL',
      joinDate: '2023-06-10',
      totalSpent: 890.25,
      orders: 5,
      lastOrder: '2023-12-15',
      status: 'active',
      segment: 'returning',
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      joinDate: '2024-01-05',
      totalSpent: 450.00,
      orders: 2,
      lastOrder: '2024-01-12',
      status: 'active',
      segment: 'new',
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      phone: '+1 (555) 567-8901',
      location: 'Chicago, IL',
      joinDate: '2022-11-08',
      totalSpent: 3200.00,
      orders: 18,
      lastOrder: '2023-10-20',
      status: 'inactive',
      segment: 'at-risk',
    },
  ];

  const segments = ['all', 'new', 'returning', 'vip', 'at-risk'];
  const statuses = ['all', 'active', 'inactive', 'vip'];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = selectedSegment === 'all' || customer.segment === selectedSegment;
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    
    return matchesSearch && matchesSegment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'vip': return 'text-purple-600 bg-purple-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <TrendingUp className="w-4 h-4" />;
      case 'vip': return <Crown className="w-4 h-4" />;
      case 'inactive': return <Calendar className="w-4 h-4" />;
      default: return null;
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'new': return 'text-blue-600 bg-blue-100';
      case 'returning': return 'text-green-600 bg-green-100';
      case 'vip': return 'text-purple-600 bg-purple-100';
      case 'at-risk': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const customerStats = [
    { label: 'Total Customers', value: customers.length, icon: Users },
    { label: 'Active Customers', value: customers.filter(c => c.status === 'active').length, icon: UserPlus },
    { label: 'VIP Customers', value: customers.filter(c => c.status === 'vip').length, icon: Crown },
    { label: 'Total Revenue', value: `$${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}`, icon: TrendingUp },
  ];

  const customerGrowthData = [
    { month: 'Jan', new: 45, returning: 120, vip: 25 },
    { month: 'Feb', new: 52, returning: 135, vip: 28 },
    { month: 'Mar', new: 48, returning: 110, vip: 22 },
    { month: 'Apr', new: 61, returning: 145, vip: 32 },
    { month: 'May', new: 55, returning: 130, vip: 30 },
    { month: 'Jun', new: 67, returning: 155, vip: 35 },
  ];

  const segmentData = [
    { segment: 'New', value: 35, color: '#3B82F6' },
    { segment: 'Returning', value: 45, color: '#10B981' },
    { segment: 'VIP', value: 15, color: '#8B5CF6' },
    { segment: 'At Risk', value: 5, color: '#EF4444' },
  ];

  const aiInsights = [
    {
      title: 'Customer Churn Prediction',
      description: '5 customers show signs of churning. Implement retention campaigns.',
      impact: 'High',
      action: 'Send personalized offers'
    },
    {
      title: 'VIP Customer Opportunity',
      description: '3 customers are close to VIP status. Consider targeted promotions.',
      impact: 'Medium',
      action: 'Create VIP upgrade campaign'
    },
    {
      title: 'New Customer Acquisition',
      description: 'Referral program showing 25% success rate. Scale up marketing.',
      impact: 'Medium',
      action: 'Increase referral incentives'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships and insights</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            </div>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-50 border-l-4 border-primary-500">
                  <h4 className="font-medium text-gray-900 mb-2">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.impact === 'High' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {insight.impact} Impact
                    </span>
                    <button className="text-xs text-primary-600 hover:text-primary-700">
                      {insight.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Customer Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="card">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="input-field"
              >
                {segments.map(segment => (
                  <option key={segment} value={segment}>
                    {segment === 'all' ? 'All Segments' : segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total Spent</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Orders</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">Joined {new Date(customer.joinDate).toLocaleDateString()}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getSegmentColor(customer.segment)}`}>
                            {customer.segment.charAt(0).toUpperCase() + customer.segment.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{customer.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{customer.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">${customer.totalSpent.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">{customer.orders}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                          {getStatusIcon(customer.status)}
                          <span className="ml-1">{customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={customerGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="new" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="returning" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="vip" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Customer Segments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {segmentData.map((item) => (
              <div key={item.segment} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.segment}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Customers; 