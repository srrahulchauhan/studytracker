import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { 
  collection, query, where, onSnapshot, 
  addDoc
} from 'firebase/firestore';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';

export const useStudySessions = () => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDemo = currentUser?.uid === 'demo-user-123';

  // Load from LocalStorage for Demo
  const loadLocalSessions = () => {
    const saved = localStorage.getItem('studyflow-demo-sessions');
    if (saved) {
      setSessions(JSON.parse(saved).sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
    } else {
      setSessions([]);
    }
    setLoading(false);
  };

  const saveLocalSession = (newSession) => {
    const saved = localStorage.getItem('studyflow-demo-sessions');
    const existing = saved ? JSON.parse(saved) : [];
    const updated = [...existing, newSession];
    localStorage.setItem('studyflow-demo-sessions', JSON.stringify(updated));
    setSessions(updated.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
  };

  useEffect(() => {
    if (!currentUser) {
      setSessions([]);
      setLoading(false);
      return;
    }

    if (isDemo) {
      loadLocalSessions();
      // Listen to storage changes from other components (like StudyTimer)
      const handleStorageChange = () => loadLocalSessions();
      window.addEventListener('storage', handleStorageChange);
      // We also need a custom event since window.addEventListener('storage') only fires across tabs
      window.addEventListener('local-session-added', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('local-session-added', handleStorageChange);
      };
    }

    try {
      const q = query(
        collection(db, 'studySessions'),
        where('uid', '==', currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const sessionData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        sessionData.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        setSessions(sessionData);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching sessions: ", error);
        setLoading(false);
      });

      return unsubscribe;
    } catch (e) {
      console.error("Firebase init failed:", e);
      setLoading(false);
    }
  }, [currentUser, isDemo]);

  const addSession = async (sessionData) => {
    const newSession = {
      ...sessionData,
      uid: currentUser.uid,
    };

    if (isDemo) {
      newSession.id = Date.now().toString();
      saveLocalSession(newSession);
      window.dispatchEvent(new Event('local-session-added'));
      return;
    }

    try {
      await addDoc(collection(db, 'studySessions'), newSession);
    } catch (error) {
      console.error("Error adding session: ", error);
      throw error;
    }
  };

  return { sessions, loading, addSession };
};
