
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "cash-compass-er7yy",
  "appId": "1:447035920516:web:425b09918c0909335d72d1",
  "storageBucket": "cash-compass-er7yy.firebasestorage.app",
  "apiKey": "AIzaSyA7zkW-om_BLTINnE_eHWbgpo30p5L75-Y",
  "authDomain": "cash-compass-er7yy.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "447035920516"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export { app };
