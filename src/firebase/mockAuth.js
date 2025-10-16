// Mock authentication for development
// This allows the app to work without Firebase setup during development

const mockUsers = new Map();
let currentMockUser = null;
let authStateListeners = [];

// Notify all listeners about auth state changes
const notifyAuthStateChange = (user) => {
  authStateListeners.forEach(callback => {
    try {
      callback(user);
    } catch (error) {
      console.error('Error in auth state listener:', error);
    }
  });
};

export const mockAuth = {
  createUserWithEmailAndPassword: async (email, password) => {
    console.log('🔧 Mock Auth: Creating user with email:', email);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mockUsers.has(email)) {
      throw new Error('auth/email-already-in-use');
    }
    
    const user = {
      uid: Math.random().toString(36).substr(2, 9),
      email,
      emailVerified: false,
      displayName: null,
      photoURL: null,
      createdAt: new Date().toISOString()
    };
    
    mockUsers.set(email, { ...user, password });
    currentMockUser = user;
    
    // Notify listeners
    setTimeout(() => notifyAuthStateChange(currentMockUser), 100);
    
    console.log('✅ Mock Auth: User created successfully');
    return { user };
  },

  signInWithEmailAndPassword: async (email, password) => {
    console.log('🔧 Mock Auth: Signing in user with email:', email);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = mockUsers.get(email);
    if (!userData || userData.password !== password) {
      console.log('❌ Mock Auth: Invalid credentials');
      throw new Error('auth/invalid-email-or-password');
    }
    
    currentMockUser = { ...userData };
    delete currentMockUser.password;
    
    // Notify listeners
    setTimeout(() => notifyAuthStateChange(currentMockUser), 100);
    
    console.log('✅ Mock Auth: User signed in successfully');
    return { user: currentMockUser };
  },

  signOut: async () => {
    console.log('🔧 Mock Auth: Signing out user');
    await new Promise(resolve => setTimeout(resolve, 500));
    currentMockUser = null;
    
    // Notify listeners
    setTimeout(() => notifyAuthStateChange(null), 100);
    
    console.log('✅ Mock Auth: User signed out successfully');
  },

  onAuthStateChanged: (callback) => {
    console.log('🔧 Mock Auth: Setting up auth state listener');
    authStateListeners.push(callback);
    
    // Immediately call with current user state
    setTimeout(() => callback(currentMockUser), 100);
    
    // Return unsubscribe function
    return () => {
      const index = authStateListeners.indexOf(callback);
      if (index > -1) {
        authStateListeners.splice(index, 1);
      }
    };
  },

  getCurrentUser: () => currentMockUser
};

// Check if we should use mock auth (when Firebase is not properly configured)
export const shouldUseMockAuth = () => {
  const hasRealFirebaseConfig = process.env.REACT_APP_FIREBASE_API_KEY && 
                                process.env.REACT_APP_FIREBASE_API_KEY !== "AIzaSyDemoKeyForDevelopment12345678901234";
  
  const forceMockAuth = process.env.REACT_APP_USE_MOCK_AUTH === 'true';
  
  const useMock = !hasRealFirebaseConfig || forceMockAuth;
  
  console.log('🔧 Auth Decision:', {
    hasRealFirebaseConfig,
    forceMockAuth,
    useMock,
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'not set'
  });
  
  return useMock;
};