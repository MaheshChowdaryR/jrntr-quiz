import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUb2gClgp4oZvNmkRZhvGqrYvJSIhpea0",
  authDomain: "jntrquiz.firebaseapp.com",
  projectId: "jntrquiz",
  storageBucket: "jntrquiz.firebasestorage.app",
  messagingSenderId: "729865093622",
  appId: "1:729865093622:web:82ca0b166131822b4387d7",
  measurementId: "G-KKDN7CQ0LQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // For anonymous sign-in
export const db = getFirestore(app); // For Firestore database

// Attempt anonymous sign-in on app load
signInAnonymously(auth)
  .then(() => {
    console.log('Anonymous sign-in successful');
  })
  .catch((error) => {
    console.error('Anonymous sign-in failed:', error.message);
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);