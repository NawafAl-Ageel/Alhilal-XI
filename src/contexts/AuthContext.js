import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password) => {
    try {
      console.log('🔥 AuthContext: Creating user with email:', email);
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('❌ AuthContext: Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔥 AuthContext: Signing in user with email:', email);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🔥 AuthContext: Signing out user');
      return await signOut(auth);
    } catch (error) {
      console.error('❌ AuthContext: Logout error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 AuthContext: Auth state changed:', user ? 'User logged in' : 'User logged out');
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};