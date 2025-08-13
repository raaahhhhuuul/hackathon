import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Download, AlertCircle } from 'lucide-react';
import { productsAPI } from '../utils/api';

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

const CSVUploadModal: React.FC<CSVUploadModalProps> = ({ isOpen, onClose, onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please select a valid CSV file.');
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await productsAPI.uploadCSV(selectedFile);
      setUploadResult(result);
      onUploadComplete();
    } catch (error: any) {
      setError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setUploadResult(null);
      setError(null);
      onClose();
    }
  };

  const downloadTemplate = () => {
    const csvContent = `name,category,sku,stock,price,cost,supplier
Laptop Pro X1,Electronics,LP-X1-001,45,1299.99,850.00,TechCorp Inc.
Smartphone Galaxy S24,Electronics,SG-S24-002,8,899.99,600.00,MobileTech Ltd.
Wireless Headphones,Audio,WH-BT-003,0,199.99,120.00,AudioPro Co.`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
              className="relative w-full max-w-lg bg-white rounded-lg shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Upload CSV File</h3>
                    <p className="text-sm text-gray-600">Bulk import products from CSV</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isUploading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {uploadResult && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-800">Upload Completed!</h4>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>Total rows processed: {uploadResult.totalRows}</p>
                      <p>Successfully imported: {uploadResult.successCount}</p>
                      {uploadResult.errorCount > 0 && (
                        <p>Errors: {uploadResult.errorCount}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                  />
                  
                  {!selectedFile ? (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-primary"
                          disabled={isUploading}
                        >
                          Select CSV File
                        </button>
                        <p className="mt-2 text-sm text-gray-600">
                          or drag and drop a CSV file here
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <FileText className="mx-auto h-12 w-12 text-green-500" />
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2 text-sm text-primary-600 hover:text-primary-500"
                          disabled={isUploading}
                        >
                          Choose different file
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* CSV Template */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">CSV Format</h4>
                    <button
                      type="button"
                      onClick={downloadTemplate}
                      className="text-sm text-primary-600 hover:text-primary-500 flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Template</span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Required columns: name, category, sku, stock, price, cost</p>
                    <p>Optional columns: supplier</p>
                    <p>Example: Laptop Pro X1,Electronics,LP-X1-001,45,1299.99,850.00,TechCorp Inc.</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    disabled={isUploading}
                  >
                    {uploadResult ? 'Close' : 'Cancel'}
                  </button>
                  {!uploadResult && (
                    <button
                      type="button"
                      onClick={handleUpload}
                      className="btn-primary flex items-center space-x-2"
                      disabled={!selectedFile || isUploading}
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>{isUploading ? 'Uploading...' : 'Upload CSV'}</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CSVUploadModal; 