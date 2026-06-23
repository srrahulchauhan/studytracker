import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiCheckSquare, 
  FiCalendar, 
  FiTarget, 
  FiPieChart, 
  FiSettings, 
  FiX,
  FiBookOpen
} from 'react-icons/fi';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: FiHome },
  { name: 'Tasks', path: '/tasks', icon: FiCheckSquare },
  { name: 'Calendar', path: '/calendar', icon: FiCalendar },
  { name: 'Habits', path: '/habits', icon: FiTarget },
  { name: 'Analytics', path: '/analytics', icon: FiPieChart },
  { name: 'Settings', path: '/settings', icon: FiSettings },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <motion.aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 glass-card border-r rounded-none border-t-0 border-b-0 border-l-0 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-xl">
            <FiBookOpen size={24} />
            <span>StudyFlow</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-light-textMuted dark:text-dark-textMuted">
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-light-textMuted dark:text-dark-textMuted hover:bg-light-hover dark:hover:bg-dark-hover'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;
