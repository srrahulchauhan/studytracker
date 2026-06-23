import { createContext, useState, useEffect } from 'react';

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
    localStorage.setItem('studyflow-user', JSON.stringify(demoUser));
  };

  const loginWithGoogle = async () => {
    alert("Google login requires a backend. Using local mock login instead.");
    const googleUser = {
      uid: 'mock-google-' + Date.now(),
      displayName: 'Google User',
      email: 'googleuser@example.com',
      photoURL: 'https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff',
    };
    setCurrentUser(googleUser);
    localStorage.setItem('studyflow-user', JSON.stringify(googleUser));
  };

  const loginWithEmail = async (email, password) => {
    // Check if user exists in local storage mock users list
    const users = JSON.parse(localStorage.getItem('studyflow-users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const loggedInUser = { ...user };
      delete loggedInUser.password;
      setCurrentUser(loggedInUser);
      localStorage.setItem('studyflow-user', JSON.stringify(loggedInUser));
      return loggedInUser;
    } else {
      throw new Error("Invalid email or password");
    }
  };

  const signupWithEmail = async (email, password, name) => {
    const users = JSON.parse(localStorage.getItem('studyflow-users') || '[]');
    if (users.find(u => u.email === email)) {
      throw new Error("Email already in use");
    }
    
    const newUser = {
      uid: 'local-user-' + Date.now(),
      displayName: name,
      email: email,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
    };
    
    users.push({ ...newUser, password });
    localStorage.setItem('studyflow-users', JSON.stringify(users));
    
    setCurrentUser(newUser);
    localStorage.setItem('studyflow-user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('studyflow-user');
    // Also remove the old demo key just in case
    localStorage.removeItem('studyflow-demo-user');
    setCurrentUser(null);
    return Promise.resolve();
  };

  useEffect(() => {
    // Check for demo or any locally saved user
    const savedUser = localStorage.getItem('studyflow-user');
    // Also try checking the old demo user key for backwards compatibility
    const oldDemoUser = localStorage.getItem('studyflow-demo-user');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else if (oldDemoUser) {
      setCurrentUser(JSON.parse(oldDemoUser));
      localStorage.setItem('studyflow-user', oldDemoUser);
      localStorage.removeItem('studyflow-demo-user');
    }
    
    setLoading(false);
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
