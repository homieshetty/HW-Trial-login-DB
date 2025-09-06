
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "hw-trial-login-db",
  "appId": "1:372604921525:web:31aa4a8d0bb97bff40c0fc",
  "storageBucket": "hw-trial-login-db.firebasestorage.app",
  "apiKey": "AIzaSyCGrEv-jLjHhX8kdYOuSxxiYfsMgek6woo",
  "authDomain": "hw-trial-login-db.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "372604921525"
};

// Initialize Firebase with error handling
let app;
let db;
let auth;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Fallback initialization
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { db, app, auth };
