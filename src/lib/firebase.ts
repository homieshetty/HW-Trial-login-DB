// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "apiKey": "mock-api-key",
  "authDomain": "mock-auth-domain",
  "projectId": "mock-project-id",
  "storageBucket": "mock-storage-bucket",
  "messagingSenderId": "mock-messaging-sender-id",
  "appId": "mock-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
