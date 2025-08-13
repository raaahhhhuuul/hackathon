import React, { useState, useEffect } from 'react';
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
  TrendingDown,
  Upload,
  RefreshCw
} from 'lucide-react';
import { productsAPI } from '../utils/api';
import AddProductModal from '../components/AddProductModal';
import CSVUploadModal from '../components/CSVUploadModal';

interface Product {
  id: number;
  name: string;
  category: string;
  sku: string;
  stock: number;
  price: number;
  cost: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  last_updated: string;
  supplier: string;
}

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isCSVUploadModalOpen, setIsCSVUploadModalOpen] = useState(false);

  // Fetch products from database
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        fetchProducts(); // Refresh the list
      } catch (error: any) {
        setError(error.message || 'Failed to delete product');
      }
    }
  };

  // Update product status based on stock
  const getProductStatus = (stock: number): 'in-stock' | 'low-stock' | 'out-of-stock' => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 10) return 'low-stock';
    return 'in-stock';
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const statuses = ['all', 'in-stock', 'low-stock', 'out-of-stock'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || getProductStatus(product.stock) === selectedStatus;
    
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
      description: `${products.filter(p => getProductStatus(p.stock) === 'out-of-stock').length} items need immediate restocking to avoid stockouts`,
      items: products.filter(p => getProductStatus(p.stock) === 'out-of-stock').slice(0, 3).map(p => p.name),
      priority: 'high'
    },
    {
      type: 'optimization',
      title: 'Inventory Optimization',
      description: 'Consider reducing stock levels for slow-moving items',
      items: products.filter(p => p.stock > 50).slice(0, 2).map(p => p.name),
      priority: 'medium'
    },
    {
      type: 'trend',
      title: 'Demand Trends',
      description: 'Monitor stock levels for popular categories',
      items: products.filter(p => getProductStatus(p.stock) === 'low-stock').slice(0, 2).map(p => p.name),
      priority: 'low'
    }
  ];

  const inventoryStats = [
    { label: 'Total Items', value: products.length, icon: Package },
    { label: 'Low Stock', value: products.filter(p => getProductStatus(p.stock) === 'low-stock').length, icon: AlertTriangle },
    { label: 'Out of Stock', value: products.filter(p => getProductStatus(p.stock) === 'out-of-stock').length, icon: AlertTriangle },
    { label: 'Total Value', value: `$${products.reduce((sum, p) => sum + (p.stock * p.cost), 0).toLocaleString()}`, icon: TrendingUp },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading inventory...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory and stock levels</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="btn-secondary flex items-center space-x-2"
            onClick={() => setIsCSVUploadModalOpen(true)}
          >
            <Upload className="w-4 h-4" />
            <span>Upload CSV</span>
          </button>
          <button 
            className="btn-primary flex items-center space-x-2"
            onClick={() => setIsAddProductModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

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
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        {products.length === 0 ? 'No products found. Add your first product to get started!' : 'No products match your search criteria.'}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const status = getProductStatus(product.stock);
                      return (
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
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                              {getStatusIcon(status)}
                              <span className="ml-1">{status.replace('-', ' ')}</span>
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
                              <button 
                                className="text-gray-400 hover:text-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onProductAdded={fetchProducts}
      />

      <CSVUploadModal
        isOpen={isCSVUploadModalOpen}
        onClose={() => setIsCSVUploadModalOpen(false)}
        onUploadComplete={fetchProducts}
      />
    </div>
  );
};

export default Inventory; 