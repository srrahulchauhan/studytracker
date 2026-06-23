import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiSquare } from 'react-icons/fi';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const StudyTimer = () => {
  const { currentUser } = useAuth();
  const [time, setTime] = useState(25 * 60); // default 25 mins
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && !isPaused && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      handleStop();
    }
    
    return () => clearInterval(timerRef.current);
  }, [isActive, isPaused, time]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = async () => {
    setIsActive(false);
    setIsPaused(false);
    clearInterval(timerRef.current);
    
    if (sessionStartTime) {
      const endTime = new Date();
      const durationSeconds = Math.floor((endTime - sessionStartTime) / 1000);
      
      const isDemo = currentUser?.uid === 'demo-user-123';
      
      if (isDemo) {
        toast.success(`Study session saved! (${Math.floor(durationSeconds/60)} mins) [Local Mode]`);
      } else {
        // Save session to Firebase
        try {
          await addDoc(collection(db, 'studySessions'), {
            uid: currentUser.uid,
            subject: "General Study", // default for now
            startTime: sessionStartTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: durationSeconds
          });
          toast.success(`Study session saved! (${Math.floor(durationSeconds/60)} mins)`);
        } catch (error) {
          console.error("Error saving session", error);
          toast.error("Failed to save session. Check Firebase config.");
        }
      }
    }
    
    // Reset
    setTime(25 * 60);
    setSessionStartTime(null);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold mb-4 text-light-textMuted dark:text-dark-textMuted">Pomodoro Timer</h3>
      
      <div className="relative mb-8">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            className="stroke-current text-light-border dark:text-dark-border"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            className="stroke-current text-primary-500"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={2 * Math.PI * 88 * (1 - time / (25 * 60))}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - time / (25 * 60)) }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-4xl font-bold font-mono tracking-wider">{formatTime(time)}</span>
        </div>
      </div>

      <div className="flex gap-4">
        {!isActive && !isPaused && (
          <button onClick={handleStart} className="btn-primary flex items-center gap-2">
            <FiPlay /> Start
          </button>
        )}
        
        {isActive && !isPaused && (
          <button onClick={handlePause} className="btn-secondary flex items-center gap-2">
            <FiPause /> Pause
          </button>
        )}
        
        {isActive && isPaused && (
          <button onClick={handleResume} className="btn-primary flex items-center gap-2">
            <FiPlay /> Resume
          </button>
        )}
        
        {isActive && (
          <button onClick={handleStop} className="btn-secondary flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
            <FiSquare /> Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default StudyTimer;
