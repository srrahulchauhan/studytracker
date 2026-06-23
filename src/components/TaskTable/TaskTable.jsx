import React from 'react';
import { FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';

const TaskTable = ({ tasks, onEdit, onDelete, onComplete }) => {
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
    <div className="glass-card overflow-x-auto rounded-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-light-border dark:border-dark-border text-sm text-light-textMuted dark:text-dark-textMuted">
            <th className="p-4 font-medium">Topic</th>
            <th className="p-4 font-medium">Subject</th>
            <th className="p-4 font-medium">Date & Time</th>
            <th className="p-4 font-medium">Priority</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-8 text-center text-light-textMuted dark:text-dark-textMuted">
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id} className="border-b border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                <td className={`p-4 font-medium ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
                  {task.topic}
                </td>
                <td className="p-4 text-sm">{task.subject}</td>
                <td className="p-4 text-sm">
                  <div>{task.date}</div>
                  <div className="text-xs text-light-textMuted dark:text-dark-textMuted">{task.startTime} - {task.endTime}</div>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="p-4 flex items-center justify-center gap-2">
                  {task.status !== 'Completed' && (
                    <button onClick={() => onComplete(task)} className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Mark Complete">
                      <FiCheck size={16} />
                    </button>
                  )}
                  <button onClick={() => onEdit(task)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                    <FiEdit2 size={16} />
                  </button>
                  <button onClick={() => onDelete(task.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
