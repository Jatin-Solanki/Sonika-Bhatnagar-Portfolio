
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3CpspBeLLNGtv8vN8YLf4WkmqE_IS3aY",
  authDomain: "sonika-ma-am-portfolio.firebaseapp.com",
  projectId: "sonika-ma-am-portfolio",
  storageBucket: "sonika-ma-am-portfolio.firebasestorage.app",
  messagingSenderId: "136504125249",
  appId: "1:136504125249:web:cb0b9f8d38ff3d43a963c0",
  measurementId: "G-F4MY01RM4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
