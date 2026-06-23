import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { 
  collection, query, where, onSnapshot, 
  addDoc, updateDoc, deleteDoc, doc 
} from 'firebase/firestore';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';

export const useTasks = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDemo = currentUser?.uid === 'demo-user-123';

  // Load from LocalStorage for Demo
  const loadLocalTasks = () => {
    const saved = localStorage.getItem('studyflow-demo-tasks');
    if (saved) {
      setTasks(JSON.parse(saved).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } else {
      setTasks([]);
    }
    setLoading(false);
  };

  const saveLocalTasks = (newTasks) => {
    localStorage.setItem('studyflow-demo-tasks', JSON.stringify(newTasks));
    setTasks(newTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    if (isDemo) {
      loadLocalTasks();
      return;
    }

    try {
      const q = query(
        collection(db, 'tasks'),
        where('uid', '==', currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        tasksData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTasks(tasksData);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching tasks: ", error);
        toast.error("Failed to load tasks from Firebase. Is config correct?");
        setLoading(false);
      });

      return unsubscribe;
    } catch (e) {
      console.error("Firebase init failed:", e);
      setLoading(false);
    }
  }, [currentUser, isDemo]);

  const addTask = async (taskData) => {
    const newTask = {
      ...taskData,
      uid: currentUser.uid,
      createdAt: new Date().toISOString(),
    };

    if (isDemo) {
      newTask.id = Date.now().toString();
      saveLocalTasks([...tasks, newTask]);
      toast.success("Task added (Local Mode)");
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), newTask);
      toast.success("Task added successfully");
    } catch (error) {
      console.error("Error adding task: ", error);
      toast.error("Failed to add task");
    }
  };

  const updateTask = async (id, updatedData) => {
    if (isDemo) {
      const updatedTasks = tasks.map(t => t.id === id ? { ...t, ...updatedData } : t);
      saveLocalTasks(updatedTasks);
      toast.success("Task updated (Local Mode)");
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, updatedData);
      toast.success("Task updated");
    } catch (error) {
      console.error("Error updating task: ", error);
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    if (isDemo) {
      const updatedTasks = tasks.filter(t => t.id !== id);
      saveLocalTasks(updatedTasks);
      toast.success("Task deleted (Local Mode)");
      return;
    }

    try {
      await deleteDoc(doc(db, 'tasks', id));
      toast.success("Task deleted");
    } catch (error) {
      console.error("Error deleting task: ", error);
      toast.error("Failed to delete task");
    }
  };

  return { tasks, loading, addTask, updateTask, deleteTask };
};
