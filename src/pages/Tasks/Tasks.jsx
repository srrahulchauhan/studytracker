import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import TaskForm from '../../components/TaskForm/TaskForm';
import TaskTable from '../../components/TaskTable/TaskTable';
import TaskCard from '../../components/TaskCard/TaskCard';
import { FiPlus, FiGrid, FiList, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Tasks = () => {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== 'All' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
    return true;
  });

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleComplete = (task) => {
    updateTask(task.id, { status: 'Completed' });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Task Management</h1>
          <p className="text-light-textMuted dark:text-dark-textMuted mt-1">
            Organize and track your study tasks
          </p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add New Task
        </button>
      </div>

      {/* Filters & View Toggle */}
      <div className="glass-card p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <FiFilter className="text-light-textMuted dark:text-dark-textMuted" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field py-1"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field py-1"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex bg-light-bg dark:bg-dark-bg rounded-lg p-1 border border-light-border dark:border-dark-border self-end md:self-auto">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-dark-card shadow-sm' : 'text-light-textMuted dark:text-dark-textMuted hover:text-gray-800 dark:hover:text-gray-200'}`}
          >
            <FiGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-dark-card shadow-sm' : 'text-light-textMuted dark:text-dark-textMuted hover:text-gray-800 dark:hover:text-gray-200'}`}
          >
            <FiList size={18} />
          </button>
        </div>
      </div>

      {/* Task List / Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : viewMode === 'grid' ? (
        filteredTasks.length === 0 ? (
          <div className="text-center py-12 glass-card text-light-textMuted dark:text-dark-textMuted">
            No tasks found. Create one to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <TaskCard 
                  task={task} 
                  onEdit={handleOpenModal} 
                  onDelete={deleteTask}
                  onComplete={handleComplete}
                />
              </motion.div>
            ))}
          </div>
        )
      ) : (
        <TaskTable 
          tasks={filteredTasks} 
          onEdit={handleOpenModal} 
          onDelete={deleteTask}
          onComplete={handleComplete}
        />
      )}

      {/* Add/Edit Modal */}
      <TaskForm 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleSubmit}
        initialData={editingTask}
      />
    </div>
  );
};

export default Tasks;
