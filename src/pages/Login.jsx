import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FiBookOpen, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Login = () => {
  const { loginWithGoogle, loginWithDemo, loginWithEmail, signupWithEmail } = useAuth();
  const navigate = useNavigate();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLoginMode) {
        await loginWithEmail(formData.email, formData.password);
        toast.success("Successfully logged in!");
      } else {
        if (!formData.name) {
          toast.error("Please enter your name");
          setLoading(false);
          return;
        }
        await signupWithEmail(formData.email, formData.password, formData.name);
        toast.success("Account created successfully!");
      }
      navigate('/dashboard');
    } catch (error) {
      console.error("Auth failed:", error);
      toast.error(error.message || "Authentication failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(`Google login failed: ${error.message}`);
    }
  };

  const handleDemoLogin = async () => {
    try {
      await loginWithDemo();
      navigate('/dashboard');
    } catch (error) {
      console.error("Demo login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-bg dark:to-dark-card p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card max-w-md w-full p-8 text-center relative overflow-hidden"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-primary-500 p-3 rounded-full text-white shadow-lg shadow-primary-500/30">
            <FiBookOpen size={32} />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-primary-900 dark:text-primary-100">StudyFlow</h1>
        <p className="text-light-textMuted dark:text-dark-textMuted mb-8">
          {isLoginMode ? "Welcome back! Please sign in." : "Create an account to get started."}
        </p>

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6 text-left">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiUser />
                </div>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10" 
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiMail />
              </div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field pl-10" 
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiLock />
              </div>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field pl-10" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-200 mt-2 flex justify-center items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              isLoginMode ? "Sign In" : "Sign Up"
            )}
          </button>
        </form>

        <div className="relative flex items-center py-2 mb-4">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border text-gray-700 dark:text-white py-3 px-4 rounded-xl hover:shadow-md hover:bg-gray-50 dark:hover:bg-dark-bg transition-all duration-200"
          >
            <FcGoogle size={24} />
            <span className="font-medium">Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white py-3 px-4 rounded-xl hover:shadow-md transition-all duration-200"
          >
            <span className="font-medium">Try Demo (No Account Required)</span>
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)} 
            className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
          >
            {isLoginMode ? "Sign Up" : "Sign In"}
          </button>
        </p>

        <div className="mt-8 text-xs text-light-textMuted dark:text-dark-textMuted">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
