import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Plus } from 'lucide-react';
import { productsAPI } from '../utils/api';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

interface ProductFormData {
  name: string;
  category: string;
  sku: string;
  stock: number;
  price: number;
  cost: number;
  supplier: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    sku: '',
    stock: 0,
    price: 0,
    cost: 0,
    supplier: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['Electronics', 'Audio', 'Furniture', 'Appliances', 'Clothing', 'Books', 'Other'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'price' || name === 'cost' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.sku) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.stock < 0 || formData.price < 0 || formData.cost < 0) {
      setError('Stock, price, and cost must be non-negative numbers.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await productsAPI.create(formData);
      setFormData({
        name: '',
        category: '',
        sku: '',
        stock: 0,
        price: 0,
        cost: 0,
        supplier: '',
      });
      onProductAdded();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: '',
        category: '',
        sku: '',
        stock: 0,
        price: 0,
        cost: 0,
        supplier: '',
      });
      setError(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-lg shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
                    <p className="text-sm text-gray-600">Enter product details below</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Enter product name"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Enter SKU"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="0"
                      min="0"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost *
                    </label>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="Enter supplier name"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>{isLoading ? 'Adding...' : 'Add Product'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddProductModal; 