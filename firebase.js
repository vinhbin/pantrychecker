// components/AnalyticsInit.js
import { useEffect } from 'react';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../path/to/your/firebase/config'; // Update this path

const app = initializeApp(firebaseConfig);

const AnalyticsInit = () => {
  useEffect(() => {
    const initAnalytics = async () => {
      // Check if Firebase Analytics is supported
      const supported = await isSupported();
      if (supported) {
        // Initialize Firebase Analytics
        getAnalytics(app);
        console.log("Firebase Analytics initialized");
      } else {
        console.log("Firebase Analytics is not supported in this environment.");
      }
    };

    // Run the initialization
    initAnalytics();
  }, []);

  return null; // No need to render anything
};

export default AnalyticsInit;
