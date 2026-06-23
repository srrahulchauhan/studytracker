import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useStudySessions } from '../hooks/useStudySessions';
import { toast } from 'react-toastify';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const { updateTask } = useTasks();
  const { addSession } = useStudySessions();
  
  const [activeTask, setActiveTask] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  const getTargetDuration = (start, end) => {
    if (!start || !end) return null;
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const startSec = sH * 3600 + sM * 60;
    const endSec = eH * 3600 + eM * 60;
    return endSec > startSec ? endSec - startSec : null;
  };

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime); // 500Hz beep
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      
      // double beep
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(500, ctx.currentTime);
        gain2.gain.setValueAtTime(0.1, ctx.currentTime);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.3);
      }, 400);

      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.error('Audio play failed', e);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          const nextTimer = prev + 1;
          const target = getTargetDuration(activeTask?.startTime, activeTask?.endTime);
          if (target && nextTimer === target) {
             playBeep();
             toast.success(`Task Complete! You reached your goal for ${activeTask.topic}.`, {
                icon: '🎉',
                autoClose: false,
             });
             showNotification('Task Complete!', `You reached your time goal for ${activeTask.topic}.`);
          }
          return nextTimer;
        });
        
        setSessionSeconds(prev => {
          const next = prev + 1;
          const breakInterval = activeTask?.breakInterval ? parseInt(activeTask.breakInterval, 10) : 0;
          if (breakInterval > 0 && next > 0 && next % (breakInterval * 60) === 0) {
            playBeep();
            toast.info(`Time for a break! You've been working on this for ${breakInterval} minutes.`, {
              icon: '🔔',
              autoClose: false, // Wait for user to dismiss
            });
            showNotification('Time for a Break!', `You've been studying for ${breakInterval} minutes.`);
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeTask]);

  const startTimer = (task) => {
    if (activeTask && activeTask.id !== task.id) {
      // Pause currently running task if any
      if (isRunning) {
        pauseTimer();
      }
    }
    
    // If it's the same task, just resume from current timerSeconds
    // If it's a new task, load its timeSpent
    if (!activeTask || activeTask.id !== task.id) {
      setActiveTask(task);
      setTimerSeconds(task.timeSpent || 0);
      setSessionSeconds(0);
    } else if (!isRunning) {
      // Resuming the same task
      setSessionSeconds(0);
    }
    
    setIsRunning(true);
    
    if (task.status === 'Pending') {
      updateTask(task.id, { status: 'In Progress' });
    }
  };

  const pauseTimer = async () => {
    if (!activeTask) return;
    
    setIsRunning(false);
    const timeSpentNow = timerSeconds;
    const previousTime = activeTask.timeSpent || 0;
    const sessionDuration = timeSpentNow - previousTime;
    
    // Update task with new timeSpent
    await updateTask(activeTask.id, { timeSpent: timeSpentNow });
    
    // Update the activeTask reference so next pause has correct baseline
    setActiveTask(prev => ({ ...prev, timeSpent: timeSpentNow }));

    if (sessionDuration > 10) {
      try {
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - sessionDuration * 1000);
        await addSession({
          subject: activeTask.subject || "General Study",
          topic: activeTask.topic || "Task",
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration: sessionDuration
        });
        toast.success(`Session saved! (+${Math.floor(sessionDuration / 60)} mins)`);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopTimer = async () => {
    if (isRunning) {
      await pauseTimer();
    }
    setActiveTask(null);
    setTimerSeconds(0);
  };

  const toggleTimer = (task) => {
    if (activeTask?.id === task.id && isRunning) {
      pauseTimer();
    } else {
      startTimer(task);
    }
  };

  return (
    <TimerContext.Provider value={{
      activeTask,
      isRunning,
      timerSeconds,
      startTimer,
      pauseTimer,
      stopTimer,
      toggleTimer
    }}>
      {children}
    </TimerContext.Provider>
  );
};
