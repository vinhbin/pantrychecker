// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { useEffect } from 'react';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGWSC72cyiHSN7DDMSBevTUpQaCbrvGmI",
  authDomain: "inventory-management-87bb7.firebaseapp.com",
  projectId: "inventory-management-87bb7",
  storageBucket: "inventory-management-87bb7.appspot.com",
  messagingSenderId: "779547406493",
  appId: "1:779547406493:web:b68a76c7e35dcd6778a474",
  measurementId: "G-54B3XY1VM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Initialize Analytics (only in the client-side)
const initAnalytics = () => {
  useEffect(() => {
    isSupported().then((supported) => {
      if (supported) {
        const analytics = getAnalytics(app);
        // Analytics can now be used
      } else {
        console.log("Firebase Analytics is not supported in this environment.");
      }
    });
  }, []);
};

export { firestore, initAnalytics };
