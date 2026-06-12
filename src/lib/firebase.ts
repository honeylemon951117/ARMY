/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9WHBkrTmZaiC5HqujdUQwqtl2Q1DRTDE",
  authDomain: "army-b2087.firebaseapp.com",
  projectId: "army-b2087",
  storageBucket: "army-b2087.firebasestorage.app",
  messagingSenderId: "995945873553",
  appId: "1:995945873553:web:2275c4a56e57e3aa1dff30",
  measurementId: "G-KZBB57J28G"
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Safe Analytics initiation
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
}).catch((err) => {
  console.warn("Analytics not supported or blocked in this environment:", err);
});

export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
