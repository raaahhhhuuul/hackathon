import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Bot, ShieldCheck, Zap, PieChart, ArrowRight } from 'lucide-react';

interface LandingProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      {/* Nav */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">AI Analytics</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary" onClick={onLogin}>Log in</button>
          <button className="btn-primary" onClick={onRegister}>Get started</button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Title and Description - Centered */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight max-w-4xl mx-auto"
          >
            AI-Powered Data Analysis for Small Businesses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Make smarter decisions with real-time dashboards, analytics, and an AI assistant that turns data into action.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3 justify-center"
          >
            <button className="btn-primary flex items-center gap-2" onClick={onRegister}>
              Start free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="btn-secondary" onClick={onLogin}>Log in</button>
          </motion.div>
        </div>

        {/* Feature Cards - Centered and Bigger */}
        <div className="text-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Live Dashboards</h3>
                <p className="text-gray-600">Track revenue, customers, and inventory in real-time with comprehensive dashboards.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <PieChart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Actionable Insights</h3>
                <p className="text-gray-600">See trends and opportunities with clear visuals and AI-powered recommendations.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Secure by Design</h3>
                <p className="text-gray-600">Built with modern best practices and enterprise-grade security standards.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* What you get box - Centered below feature cards */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="card max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-8 border border-primary-100">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl font-semibold text-gray-900">What you get</h3>
              </div>
              <ul className="space-y-3 text-gray-700 list-disc pl-6 text-left">
                <li>Complete Dashboard, Inventory, Analytics, Customers, and Sales management</li>
                <li>AI chatbot for instant answers and business insights</li>
                <li>Interactive charts and comprehensive reports</li>
                <li>Responsive UI and lightning-fast performance</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-10 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} AI Analytics. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;

