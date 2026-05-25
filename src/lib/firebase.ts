import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAd2ZdjWT8_MhU5LtUfU3Mz4U5wdJdsriU",
  authDomain: "ntestspeed.firebaseapp.com",
  projectId: "ntestspeed",
  storageBucket: "ntestspeed.firebasestorage.app",
  messagingSenderId: "75989311394",
  appId: "1:75989311394:web:8c26b5f44aa8526c459cfb",
  measurementId: "G-F468NXPRNF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore & Auth if needed across your app
export const db = getFirestore(app);
export const auth = getAuth(app);

// Gracefully handle analytics initialization (in case of sandboxed iFrame/IndexedDB restrictions)
let analytics: any = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("[Firebase] Analytics is supported and initialized successfully.");
  } else {
    console.warn("[Firebase] Analytics is not supported in this browser environment.");
  }
}).catch((err) => {
  console.warn("[Firebase] Failed to initialize analytics gracefully:", err);
});

export { app, analytics };
