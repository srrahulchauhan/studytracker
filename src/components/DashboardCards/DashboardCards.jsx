import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiCircle, FiTrendingUp, FiBook, FiAward } from 'react-icons/fi';

const metrics = [
  { id: 1, title: "Today's Study Hours", value: "3.5h", icon: FiClock, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  { id: 2, title: "Total Study Hours", value: "124h", icon: FiAward, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  { id: 3, title: "Completed Tasks", value: "12", icon: FiCheckCircle, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  { id: 4, title: "Pending Tasks", value: "5", icon: FiCircle, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  { id: 5, title: "Current Streak", value: "7 Days \uD83D\uDD25", icon: FiTrendingUp, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  { id: 6, title: "Most Studied", value: "React JS", icon: FiBook, color: "text-primary-500", bg: "bg-primary-100 dark:bg-primary-900/30" },
];

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="glass-card p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-light-textMuted dark:text-dark-textMuted mb-1">{metric.title}</p>
            <h3 className="text-2xl font-bold">{metric.value}</h3>
          </div>
          <div className={`p-4 rounded-xl ${metric.bg} ${metric.color}`}>
            <metric.icon size={24} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardCards;
