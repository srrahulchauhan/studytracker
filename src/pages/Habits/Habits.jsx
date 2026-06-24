import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiActivity } from 'react-icons/fi';

// Dummy initial data
const initialHabits = [
  { id: 1, name: 'Study', streak: 5, longest: 12, completedToday: false, progress: 75 },
  { id: 2, name: 'Coding', streak: 12, longest: 20, completedToday: true, progress: 90 },
  { id: 3, name: 'Reading', streak: 2, longest: 5, completedToday: false, progress: 40 },
  { id: 4, name: 'Exercise', streak: 0, longest: 14, completedToday: false, progress: 20 },
];

const Habits = () => {
  const [habits, setHabits] = useState(initialHabits);

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const isCompleted = !habit.completedToday;
        return {
          ...habit,
          completedToday: isCompleted,
          streak: isCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    }));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Habit Tracker</h1>
        <p className="text-light-textMuted dark:text-dark-textMuted mt-1">
          Build consistency with daily habits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="glass-card p-6 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <FiActivity className="text-primary-500" /> {habit.name}
                </h3>
                <p className="text-sm text-light-textMuted dark:text-dark-textMuted mt-1">
                  Current Streak: <span className="font-bold text-primary-600 dark:text-primary-400">{habit.streak} Days 🔥</span>
                </p>
                <p className="text-xs text-light-textMuted dark:text-dark-textMuted">
                  Longest Streak: {habit.longest} Days
                </p>
              </div>

              {/* Circular Progress */}
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" className="stroke-current text-light-border dark:text-dark-border" strokeWidth="6" fill="transparent" />
                  <motion.circle
                    cx="32" cy="32" r="28"
                    className="stroke-current text-primary-500" strokeWidth="6" fill="transparent"
                    strokeDasharray={2 * Math.PI * 28}
                    strokeDashoffset={2 * Math.PI * 28 * (1 - habit.progress / 100)}
                    initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - habit.progress / 100) }}
                    transition={{ duration: 1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {habit.progress}%
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => toggleHabit(habit.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-medium ${
                  habit.completedToday
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-light-bg dark:bg-dark-bg text-light-textMuted dark:text-dark-textMuted hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600'
                }`}
              >
                {habit.completedToday ? (
                  <>
                    <FiCheck size={20} /> Completed
                  </>
                ) : (
                  <>
                    <FiCheck size={20} className="opacity-50" /> Mark Complete
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Habits;
