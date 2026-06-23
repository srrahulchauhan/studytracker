import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiClock, FiCalendar, FiStar, FiPlay, FiSquare } from 'react-icons/fi';
import { useStudySessions } from '../../hooks/useStudySessions';
import { toast } from 'react-toastify';

const TaskCard = ({ task, onEdit, onDelete, onComplete, onUpdate }) => {
  const { addSession } = useStudySessions();
  const [isRunning, setIsRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(task.timeSpent || 0);

  // Sync state if task is updated externally
  useEffect(() => {
    if (!isRunning) {
      setTimerSeconds(task.timeSpent || 0);
    }
  }, [task.timeSpent, isRunning]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else if (!isRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const handleToggleTimer = async () => {
    if (isRunning) {
      // Pause
      setIsRunning(false);
      const timeSpentNow = timerSeconds;
      
      // Calculate session duration (the diff from what was saved)
      const previousTime = task.timeSpent || 0;
      const sessionDuration = timeSpentNow - previousTime;

      // Update task
      onUpdate(task.id, { timeSpent: timeSpentNow });

      // Add to study sessions if duration > 10 seconds (to avoid spam)
      if (sessionDuration > 10) {
        try {
          const endTime = new Date();
          const startTime = new Date(endTime.getTime() - sessionDuration * 1000);
          
          await addSession({
            subject: task.subject,
            topic: task.topic,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: sessionDuration
          });
          toast.success(`Session saved! (+${Math.floor(sessionDuration / 60)} mins)`);
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      // Play
      if (task.status === 'Completed') return;
      setIsRunning(true);
      // If task is pending, move to in-progress
      if (task.status === 'Pending') {
        onUpdate(task.id, { status: 'In Progress' });
      }
    }
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
    <div className={`glass-card p-5 border-l-4 ${task.status === 'Completed' ? 'border-l-green-500 opacity-70' : 'border-l-primary-500'} flex flex-col h-full relative`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap gap-2 items-center">
          <button onClick={toggleStar} className={`p-1 transition-colors ${task.isStarred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}>
            <FiStar size={18} fill={task.isStarred ? "currentColor" : "none"} />
          </button>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
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
        <div className="flex items-center justify-between text-xs text-light-textMuted dark:text-dark-textMuted">
          <div className="flex items-center gap-2">
            <FiCalendar size={14} />
            <span>{task.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock size={14} />
            <span>{task.startTime} - {task.endTime}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          {/* Live Timer Controls */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleToggleTimer}
              disabled={task.status === 'Completed'}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                isRunning 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50' 
                  : 'bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/30 dark:hover:bg-primary-900/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isRunning ? <FiSquare size={14} fill="currentColor" /> : <FiPlay size={14} fill="currentColor" className="ml-1" />}
            </button>
            <span className={`font-mono font-medium ${isRunning ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {formatTime(timerSeconds)}
            </span>
          </div>
          
          {task.status !== 'Completed' && (
            <button 
              onClick={() => {
                if (isRunning) handleToggleTimer(); // Pause before complete
                onComplete(task);
              }}
              className="text-sm text-green-600 font-medium hover:underline bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg"
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
