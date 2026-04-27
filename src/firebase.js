import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB41B6SzLlBsMnTAgULtGCEabHgs67Nd44",
  authDomain: "nang-9255a.firebaseapp.com",
  projectId: "nang-9255a",
  storageBucket: "nang-9255a.firebasestorage.app",
  messagingSenderId: "694531734943",
  appId: "1:694531734943:web:0f822011e1cb8d848b91aa",
  measurementId: "G-B945NQV8DE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
