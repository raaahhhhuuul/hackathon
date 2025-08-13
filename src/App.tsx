import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Profile from './pages/Profile';
import Chatbot from './components/Chatbot';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext';

type Page = 'dashboard' | 'inventory' | 'analytics' | 'customers' | 'sales' | 'profile';
type AuthView = 'landing' | 'login' | 'register';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('landing');
  const { isAuthenticated, isLoading, logout } = useAuth();

  const handleLogin = () => {
    setAuthView('landing');
  };

  const handleLogout = () => {
    logout();
    setAuthView('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'analytics':
        return <Analytics />;
      case 'customers':
        return <Customers />;
      case 'sales':
        return <Sales />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated views
  if (!isAuthenticated) {
    if (authView === 'landing') {
      return (
        <Landing
          onLogin={() => setAuthView('login')}
          onRegister={() => setAuthView('register')}
        />
      );
    }
    if (authView === 'login') {
      return (
        <Login
          onBack={() => setAuthView('landing')}
          onRegister={() => setAuthView('register')}
          onSuccess={handleLogin}
        />
      );
    }
    return (
      <Register
        onBack={() => setAuthView('landing')}
        onLogin={() => setAuthView('login')}
        onSuccess={handleLogin}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chatbot */}
      <AnimatePresence>
        {isChatbotOpen && (
          <Chatbot onClose={() => setIsChatbotOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 