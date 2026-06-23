import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiStar, FiPlay, FiSquare } from 'react-icons/fi';
import { useStudySessions } from '../../hooks/useStudySessions';
import { toast } from 'react-toastify';
import { useTimer } from '../../context/TimerContext';

const TaskTableRow = ({ task, onEdit, onDelete, onComplete, onUpdate }) => {
  const { activeTask, isRunning: globalIsRunning, timerSeconds: globalTimerSeconds, pauseTimer, toggleTimer } = useTimer();

  const isThisTaskActive = activeTask?.id === task.id;
  const isRunning = isThisTaskActive && globalIsRunning;
  const timerSeconds = isThisTaskActive ? globalTimerSeconds : (task.timeSpent || 0);

  const handleToggleTimer = () => {
    toggleTimer(task);
  };

  const toggleStar = () => {
    onUpdate(task.id, { isStarred: !task.isStarred });
  };

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
    <tr className="border-b border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <button onClick={toggleStar} className={`p-1 transition-colors ${task.isStarred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}>
            <FiStar size={18} fill={task.isStarred ? "currentColor" : "none"} />
          </button>
          <span className={`font-medium ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
            {task.topic}
          </span>
        </div>
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
      <td className="p-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleToggleTimer}
            disabled={task.status === 'Completed'}
            className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
              isRunning 
                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30' 
                : 'bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/30'
            } disabled:opacity-50`}
          >
            {isRunning ? <FiSquare size={12} fill="currentColor" /> : <FiPlay size={12} fill="currentColor" className="ml-0.5" />}
          </button>
          <span className={`font-mono text-sm font-medium ${isRunning ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {formatTime(timerSeconds)}
          </span>
        </div>
      </td>
      <td className="p-4 flex items-center justify-center gap-2">
        {task.status !== 'Completed' && (
          <button 
            onClick={() => {
              if (isRunning) pauseTimer();
              onComplete(task);
            }} 
            className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" 
            title="Mark Complete"
          >
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
  );
};

const TaskTable = ({ tasks, onEdit, onDelete, onComplete, onUpdate }) => {
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
            <th className="p-4 font-medium">Time Spent</th>
            <th className="p-4 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-8 text-center text-light-textMuted dark:text-dark-textMuted">
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <TaskTableRow 
                key={task.id} 
                task={task} 
                onEdit={onEdit} 
                onDelete={onDelete} 
                onComplete={onComplete} 
                onUpdate={onUpdate}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
