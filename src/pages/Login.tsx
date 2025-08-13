import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, LogIn } from 'lucide-react';

interface LoginProps {
  onBack: () => void;
  onRegister: () => void;
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack, onRegister, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError(null);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <button className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card"
        >
          <h1 className="text-2xl font-bold text-gray-900">Log in</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back. Enter your details to continue.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  className="input-field pl-9"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  className="input-field pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /> Log in
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <button className="text-primary-600 hover:underline" onClick={onRegister}>Create one</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

