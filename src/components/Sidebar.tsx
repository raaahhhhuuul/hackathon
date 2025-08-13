import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Users, 
  ShoppingCart,
  Brain,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: 'dashboard' | 'inventory' | 'analytics' | 'customers' | 'sales' | 'profile') => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Innosolve</h1>
              <p className="text-sm text-gray-500">Business Intelligence</p>
            </div>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <button
                  onClick={() => {
                    onPageChange('profile');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Profile</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Log out</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">AI Assistant</span>
          </div>
          <p className="text-xs text-gray-600">
            Get instant insights and recommendations powered by AI
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar; 