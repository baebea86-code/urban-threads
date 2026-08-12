import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBoqySIkvmUmuuKV1ACrutBNviLMWrdV1U",
  authDomain: "urban-threads-c714e.firebaseapp.com",
  projectId: "urban-threads-c714e",
  storageBucket: "urban-threads-c714e.firebasestorage.app",
  messagingSenderId: "971270209119",
  appId: "1:971270209119:web:7cc011c35feb8b0e4ae5ea",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
