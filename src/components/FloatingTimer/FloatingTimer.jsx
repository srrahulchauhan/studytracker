import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiSquare, FiX, FiClock } from 'react-icons/fi';
import { useTimer } from '../../context/TimerContext';
import { useNavigate } from 'react-router-dom';

const FloatingTimer = () => {
  const { activeTask, isRunning, timerSeconds, pauseTimer, startTimer, stopTimer } = useTimer();
  const navigate = useNavigate();

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {activeTask && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 glass-card shadow-xl border border-primary-500/30 overflow-hidden flex flex-col"
          style={{ width: '320px' }}
        >
          {/* Top Progress Bar indicator */}
          {isRunning && (
            <motion.div 
              className="h-1 bg-primary-500 w-full origin-left"
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
          )}

          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div 
                className="cursor-pointer group flex-1 mr-2"
                onClick={() => navigate('/tasks')}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1">
                  <FiClock size={12} /> Active Task
                  {activeTask.breakInterval > 0 && (
                    <span className="ml-auto flex items-center gap-1 text-orange-500 bg-orange-50 dark:bg-orange-900/30 px-1.5 py-0.5 rounded-md text-[10px]" title={`Break alarm every ${activeTask.breakInterval}m`}>
                      🔔 {activeTask.breakInterval}m
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm line-clamp-1 group-hover:text-primary-500 transition-colors">
                  {activeTask.topic}
                </h4>
                <p className="text-xs text-light-textMuted dark:text-dark-textMuted truncate">
                  {activeTask.subject}
                </p>
              </div>
              <button 
                onClick={stopTimer}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Dismiss"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-1 bg-light-bg dark:bg-dark-bg p-2.5 rounded-xl border border-light-border dark:border-dark-border">
              <span className={`font-mono text-xl tracking-wider font-bold ${isRunning ? 'text-primary-500' : 'text-gray-500'}`}>
                {formatTime(timerSeconds)}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => isRunning ? pauseTimer() : startTimer(activeTask)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-sm ${
                    isRunning 
                      ? 'bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-900/30' 
                      : 'bg-primary-500 text-white hover:bg-primary-600 shadow-primary-500/30'
                  }`}
                >
                  {isRunning ? <FiPause size={18} fill="currentColor" /> : <FiPlay size={18} fill="currentColor" className="ml-1" />}
                </button>
                <button
                  onClick={stopTimer}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 transition-colors"
                  title="Stop and save session"
                >
                  <FiSquare size={16} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingTimer;
