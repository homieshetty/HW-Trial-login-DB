
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

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const auth = getAuth(app);

export { db, app, auth };
