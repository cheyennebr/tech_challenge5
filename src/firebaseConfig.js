// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Add this import for Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAFa1E2Qvm6Ip-ue4Yic31LgA0ZDMdcKlY",
    authDomain: "techchallenge-87b86.firebaseapp.com",
    projectId: "techchallenge-87b86",
    storageBucket: "techchallenge-87b86.appspot.com",
    messagingSenderId: "697683093221",
    appId: "1:697683093221:web:714eabf51805e70c6fd60c",
    measurementId: "G-ZDHZ0C3VJK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

// Export the Firestore database for use in your app
export { db };