import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';

export const useTasks = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from LocalStorage
  const loadLocalTasks = () => {
    if (!currentUser) return;
    const saved = localStorage.getItem(`studyflow-tasks-${currentUser.uid}`);
    if (saved) {
      setTasks(JSON.parse(saved).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } else {
      setTasks([]);
    }
    setLoading(false);
  };

  const saveLocalTasks = (newTasks) => {
    if (!currentUser) return;
    localStorage.setItem(`studyflow-tasks-${currentUser.uid}`, JSON.stringify(newTasks));
    setTasks(newTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    loadLocalTasks();
  }, [currentUser]);

  const addTask = async (taskData) => {
    const newTask = {
      ...taskData,
      uid: currentUser.uid,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    saveLocalTasks([...tasks, newTask]);
    toast.success("Task added");
  };

  const updateTask = async (id, updatedData) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, ...updatedData } : t);
    saveLocalTasks(updatedTasks);
    toast.success("Task updated");
  };

  const deleteTask = async (id) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    saveLocalTasks(updatedTasks);
    toast.success("Task deleted");
  };

  return { tasks, loading, addTask, updateTask, deleteTask };
};
