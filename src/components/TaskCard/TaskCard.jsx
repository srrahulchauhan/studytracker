import React from 'react';
import { FiEdit2, FiTrash2, FiClock, FiCalendar } from 'react-icons/fi';

const TaskCard = ({ task, onEdit, onDelete, onComplete }) => {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'Medium': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'Low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'In Progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'Pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`glass-card p-5 border-l-4 ${task.status === 'Completed' ? 'border-l-green-500 opacity-70' : 'border-l-primary-500'} flex flex-col h-full`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ml-2 ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(task)} className="p-1 text-gray-500 hover:text-blue-500 transition-colors">
            <FiEdit2 size={16} />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1 text-gray-500 hover:text-red-500 transition-colors">
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
      
      <h3 className={`font-bold text-lg ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
        {task.topic}
      </h3>
      <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">{task.subject}</p>
      
      {task.description && (
        <p className="text-sm text-light-textMuted dark:text-dark-textMuted mb-4 line-clamp-2 flex-grow">
          {task.description}
        </p>
      )}
      
      <div className="mt-auto pt-4 border-t border-light-border dark:border-dark-border flex flex-col gap-2">
        <div className="flex items-center text-xs text-light-textMuted dark:text-dark-textMuted gap-2">
          <FiCalendar size={14} />
          <span>{task.date}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-light-textMuted dark:text-dark-textMuted">
          <div className="flex items-center gap-2">
            <FiClock size={14} />
            <span>{task.startTime} - {task.endTime}</span>
          </div>
          
          {task.status !== 'Completed' && (
            <button 
              onClick={() => onComplete(task)}
              className="text-green-600 font-medium hover:underline"
            >
              Mark Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
