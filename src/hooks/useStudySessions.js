import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useStudySessions = () => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from LocalStorage
  const loadLocalSessions = () => {
    if (!currentUser) return;
    const saved = localStorage.getItem(`studyflow-sessions-${currentUser.uid}`);
    if (saved) {
      setSessions(JSON.parse(saved).sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
    } else {
      setSessions([]);
    }
    setLoading(false);
  };

  const saveLocalSession = (newSession) => {
    if (!currentUser) return;
    const saved = localStorage.getItem(`studyflow-sessions-${currentUser.uid}`);
    const existing = saved ? JSON.parse(saved) : [];
    const updated = [...existing, newSession];
    localStorage.setItem(`studyflow-sessions-${currentUser.uid}`, JSON.stringify(updated));
    setSessions(updated.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
  };

  useEffect(() => {
    if (!currentUser) {
      setSessions([]);
      setLoading(false);
      return;
    }

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
  }, [currentUser]);

  const addSession = async (sessionData) => {
    const newSession = {
      ...sessionData,
      uid: currentUser.uid,
      id: Date.now().toString(),
    };

    saveLocalSession(newSession);
    window.dispatchEvent(new Event('local-session-added'));
  };

  return { sessions, loading, addSession };
};
