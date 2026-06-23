import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const TaskForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    priority: 'Medium',
    status: 'Pending'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        subject: '',
        topic: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        priority: 'Medium',
        status: 'Pending'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b border-light-border dark:border-dark-border">
              <h2 className="text-xl font-bold">{initialData ? 'Edit Task' : 'Add New Task'}</h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto scrollbar-hide">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input required type="text" name="subject" value={formData.subject} onChange={handleChange} className="input-field" placeholder="e.g. Mathematics" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Topic</label>
                <input required type="text" name="topic" value={formData.topic} onChange={handleChange} className="input-field" placeholder="e.g. Calculus Integration" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="input-field resize-none h-20" placeholder="Details..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input required type="date" name="date" value={formData.date} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="input-field">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input required type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Task</button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskForm;
