import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiActivity, FiPlus, FiTrash2 } from 'react-icons/fi';

const Habits = () => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('studyflow-habits');
    return saved ? JSON.parse(saved) : [];
  });
  const [newHabitName, setNewHabitName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem('studyflow-habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    
    const newHabit = {
      id: Date.now(),
      name: newHabitName.trim(),
      streak: 0,
      longest: 0,
      completedToday: false,
      progress: 0
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setIsAdding(false);
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const isCompleted = !habit.completedToday;
        const newStreak = isCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        return {
          ...habit,
          completedToday: isCompleted,
          streak: newStreak,
          longest: Math.max(habit.longest || 0, newStreak),
          progress: isCompleted ? 100 : 0
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Habit Tracker</h1>
          <p className="text-light-textMuted dark:text-dark-textMuted mt-1">
            Build consistency with daily habits
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl transition-colors shadow-sm shadow-primary-500/30 font-medium"
        >
          {isAdding ? <FiX size={18} /> : <FiPlus size={18} />}
          {isAdding ? 'Cancel' : 'New Habit'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, mb: 0 }}
            animate={{ opacity: 1, height: 'auto', mb: 24 }}
            exit={{ opacity: 0, height: 0, mb: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={addHabit} className="glass-card p-6 flex items-center gap-4">
              <input
                type="text"
                placeholder="What habit do you want to build? (e.g. Read 10 pages)"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                autoFocus
                className="flex-1 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
              />
              <button 
                type="submit"
                disabled={!newHabitName.trim()}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {habits.length === 0 && !isAdding ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mb-4">
            <FiActivity size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No habits yet</h3>
          <p className="text-light-textMuted dark:text-dark-textMuted max-w-md mx-auto mb-6">
            Start building good routines by adding your first daily habit. Small steps lead to big results!
          </p>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl transition-colors shadow-sm shadow-primary-500/30 font-medium"
          >
            Create First Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-card p-6 flex flex-col justify-between group"
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

                <div className="flex flex-col items-end gap-2">
                  <button 
                    onClick={() => deleteHabit(habit.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                    title="Delete Habit"
                  >
                    <FiTrash2 size={16} />
                  </button>
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
      )}
    </div>
  );
};

export default Habits;
