import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { FiMenu, FiSun, FiMoon, FiBell, FiSearch, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="h-16 glass-card border-x-0 border-t-0 rounded-none flex items-center justify-between px-4 md:px-6 z-30 relative">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden p-2 text-light-textMuted dark:text-dark-textMuted">
          <FiMenu size={24} />
        </button>
        
        <div className="hidden md:flex items-center bg-light-bg dark:bg-dark-bg px-3 py-2 rounded-lg border border-light-border dark:border-dark-border w-64">
          <FiSearch className="text-light-textMuted dark:text-dark-textMuted mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover transition-colors text-light-textMuted dark:text-dark-textMuted"
        >
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        <button className="p-2 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover transition-colors text-light-textMuted dark:text-dark-textMuted relative">
          <FiBell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.email || 'User'}&background=random`} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border-2 border-primary-500 object-cover"
            />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 glass-card border border-light-border dark:border-dark-border z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-light-border dark:border-dark-border">
                    <p className="font-medium truncate">{currentUser?.displayName || 'User'}</p>
                    <p className="text-xs text-light-textMuted dark:text-dark-textMuted truncate">{currentUser?.email}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
