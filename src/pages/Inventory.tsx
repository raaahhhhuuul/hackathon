import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  Brain,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  price: number;
  cost: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
  supplier: string;
}

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock inventory data
  const products: Product[] = [
    {
      id: '1',
      name: 'Laptop Pro X1',
      category: 'Electronics',
      sku: 'LP-X1-001',
      stock: 45,
      price: 1299.99,
      cost: 850.00,
      status: 'in-stock',
      lastUpdated: '2024-01-15',
      supplier: 'TechCorp Inc.',
    },
    {
      id: '2',
      name: 'Smartphone Galaxy S24',
      category: 'Electronics',
      sku: 'SG-S24-002',
      stock: 8,
      price: 899.99,
      cost: 600.00,
      status: 'low-stock',
      lastUpdated: '2024-01-14',
      supplier: 'MobileTech Ltd.',
    },
    {
      id: '3',
      name: 'Wireless Headphones',
      category: 'Audio',
      sku: 'WH-BT-003',
      stock: 0,
      price: 199.99,
      cost: 120.00,
      status: 'out-of-stock',
      lastUpdated: '2024-01-13',
      supplier: 'AudioPro Co.',
    },
    {
      id: '4',
      name: 'Office Chair Ergonomic',
      category: 'Furniture',
      sku: 'OC-ERG-004',
      stock: 23,
      price: 299.99,
      cost: 180.00,
      status: 'in-stock',
      lastUpdated: '2024-01-12',
      supplier: 'FurnitureMax',
    },
    {
      id: '5',
      name: 'Coffee Maker Premium',
      category: 'Appliances',
      sku: 'CM-PREM-005',
      stock: 5,
      price: 149.99,
      cost: 90.00,
      status: 'low-stock',
      lastUpdated: '2024-01-11',
      supplier: 'KitchenPro',
    },
  ];

  const categories = ['all', 'Electronics', 'Audio', 'Furniture', 'Appliances'];
  const statuses = ['all', 'in-stock', 'low-stock', 'out-of-stock'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'text-green-600 bg-green-100';
      case 'low-stock': return 'text-yellow-600 bg-yellow-100';
      case 'out-of-stock': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock': return <CheckCircle className="w-4 h-4" />;
      case 'low-stock': return <AlertTriangle className="w-4 h-4" />;
      case 'out-of-stock': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const aiRecommendations = [
    {
      type: 'restock',
      title: 'Restock Recommendations',
      description: '5 items need immediate restocking to avoid stockouts',
      items: ['Wireless Headphones', 'Coffee Maker Premium', 'Smartphone Galaxy S24'],
      priority: 'high'
    },
    {
      type: 'optimization',
      title: 'Inventory Optimization',
      description: 'Consider reducing stock levels for slow-moving items',
      items: ['Office Chair Ergonomic'],
      priority: 'medium'
    },
    {
      type: 'trend',
      title: 'Demand Trends',
      description: 'Electronics category showing 25% increase in demand',
      items: ['Laptop Pro X1', 'Smartphone Galaxy S24'],
      priority: 'low'
    }
  ];

  const inventoryStats = [
    { label: 'Total Items', value: products.length, icon: Package },
    { label: 'Low Stock', value: products.filter(p => p.status === 'low-stock').length, icon: AlertTriangle },
    { label: 'Out of Stock', value: products.filter(p => p.status === 'out-of-stock').length, icon: AlertTriangle },
    { label: 'Total Value', value: `$${products.reduce((sum, p) => sum + (p.stock * p.cost), 0).toLocaleString()}`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory and stock levels</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventoryStats.map((stat, index) => {
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
        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
            </div>
            <div className="space-y-4">
              {aiRecommendations.map((rec, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-50 border-l-4 border-primary-500">
                  <h4 className="font-medium text-gray-900 mb-2">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  <div className="space-y-1">
                    {rec.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="text-sm text-gray-700 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {rec.priority} priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Product Table */}
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
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
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
                    {status === 'all' ? 'All Status' : status.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">SKU</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{product.sku}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">{product.stock}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">${product.price}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {getStatusIcon(product.status)}
                          <span className="ml-1">{product.status.replace('-', ' ')}</span>
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
    </div>
  );
};

export default Inventory; 