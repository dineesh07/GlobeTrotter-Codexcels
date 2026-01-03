import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD6jPY1YrshYT09TnaDJOIquaKwvKHjue4",
    authDomain: "globetrotter-codexcels.firebaseapp.com",
    projectId: "globetrotter-codexcels",
    storageBucket: "globetrotter-codexcels.firebasestorage.app",
    messagingSenderId: "682422703002",
    appId: "1:682422703002:web:cf8614e33124dd9a76e023",
    measurementId: "G-RHMJZV6HPH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
