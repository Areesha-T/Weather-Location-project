import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Updated firebaseConfig with corrected API Key and Auth/Firestore setup
const firebaseConfig = {
  apiKey: "AIzaSyA0kvl83uG7u0i3JWrJSp-smeDyXVi1nO0",
  authDomain: "my-project-f0bb7.firebaseapp.com",
  projectId: "my-project-f0bb7",
  storageBucket: "my-project-f0bb7.firebasestorage.app",
  messagingSenderId: "92795858709",
  appId: "1:92795858709:web:178d97969e30191261c31c",
  measurementId: "G-CNZD7Q317C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);