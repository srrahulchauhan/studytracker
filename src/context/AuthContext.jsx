import { createContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { saveUserToFirestore } from '../firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithDemo = async () => {
    const demoUser = {
      uid: 'demo-user-123',
      displayName: 'Demo Student',
      email: 'demo@studyflow.app',
      photoURL: 'https://ui-avatars.com/api/?name=Demo+Student&background=14b8a6&color=fff',
    };
    setCurrentUser(demoUser);
    localStorage.setItem('studyflow-demo-user', JSON.stringify(demoUser));
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(result.user);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Wait for onAuthStateChanged to pick it up, or save to firestore if needed
      return result;
    } catch (error) {
      console.error("Error signing in with Email", error);
      throw error;
    }
  };

  const signupWithEmail = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Set a displayName for the newly created user (optional, can be done via updateProfile)
      await saveUserToFirestore({
        ...result.user,
        displayName: name
      });
      return result;
    } catch (error) {
      console.error("Error signing up with Email", error);
      throw error;
    }
  };

  const logout = () => {
    if (localStorage.getItem('studyflow-demo-user')) {
      localStorage.removeItem('studyflow-demo-user');
      setCurrentUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  };

  useEffect(() => {
    // Check for demo user first
    const demoUser = localStorage.getItem('studyflow-demo-user');
    if (demoUser) {
      setCurrentUser(JSON.parse(demoUser));
      setLoading(false);
      return;
    }

    // Otherwise use Firebase
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) {
          try {
            await saveUserToFirestore(user);
          } catch(e) {
             console.log("Firestore save failed (likely missing config), skipping.");
          }
        }
        setLoading(false);
      }, (error) => {
        console.error("Auth state error (check Firebase config):", error);
        setLoading(false); // Make sure to stop loading even on error
      });

      return unsubscribe;
    } catch (error) {
      console.error("Firebase init error:", error);
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    loginWithGoogle,
    loginWithDemo,
    loginWithEmail,
    signupWithEmail,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
