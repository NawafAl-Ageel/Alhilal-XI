import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// For development, you can use these demo credentials or replace with your actual Firebase config

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC25dJ11zxpFAjOf3-5nepYyNlMLvTmObA",
  authDomain: "tawuniya-a9ca1.firebaseapp.com",
  projectId: "tawuniya-a9ca1",
  storageBucket: "tawuniya-a9ca1.firebasestorage.app",
  messagingSenderId: "521065951429",
  appId: "1:521065951429:web:c2458733c51c30962cc0ac",
  measurementId: "G-KTJP2ZX98G"
};


// For development purposes, let's use Firebase Emulator if no real config is provided
if (!process.env.REACT_APP_FIREBASE_API_KEY) {
  console.warn('⚠️ Using demo Firebase config. Please set up your Firebase project and update the configuration.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// For development, you can use Firebase emulator
if (!process.env.REACT_APP_FIREBASE_API_KEY && process.env.NODE_ENV === 'development') {
  // Uncomment below lines if you want to use Firebase emulator
  // import { connectAuthEmulator } from 'firebase/auth';
  // connectAuthEmulator(auth, 'http://localhost:9099');
}

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

export default app;