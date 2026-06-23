import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMWbtgh7ddGFpdD1uOINtjCyZCibUOP7I",
  authDomain: "studytracker-ba86e.firebaseapp.com",
  projectId: "studytracker-ba86e",
  storageBucket: "studytracker-ba86e.firebasestorage.app",
  messagingSenderId: "41814084126",
  appId: "1:41814084126:web:fc814b4e31358c103cbc0f",
  measurementId: "G-Q8M5K0J17Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
