// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaX4zcCX-8abFHNRAS9uJAtRbknGgP1Rw",
  authDomain: "propertydeals-51e7e.firebaseapp.com",
  projectId: "propertydeals-51e7e",
  storageBucket: "propertydeals-51e7e.firebasestorage.app",
  messagingSenderId: "277142068499",
  appId: "1:277142068499:web:4acefb6707df4cdd748ee6",
  measurementId: "G-5HK2EYD65K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 


