// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
