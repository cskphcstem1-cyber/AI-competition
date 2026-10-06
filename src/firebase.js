import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2ItH90HR5ObFMM10TVWz7eeoVBaWmRg8",
  authDomain: "ai-competition-b3bff.firebaseapp.com",
  projectId: "ai-competition-b3bff",
  storageBucket: "ai-competition-b3bff.firebasestorage.app",
  messagingSenderId: "427755420545",
  appId: "1:427755420545:web:739b53b6dbde8c25fb4680",
  measurementId: "G-F2Y82W0GB7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
