// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore};