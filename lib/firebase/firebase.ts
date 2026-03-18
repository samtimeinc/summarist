import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJ-lYVZ8JJhsWncWxWIryYaof60FeOXqw",
    authDomain: "summarist-app-e29b5.firebaseapp.com",
    projectId: "summarist-app-e29b5",
    storageBucket: "summarist-app-e29b5.firebasestorage.app",
    messagingSenderId: "989230222195",
    appId: "1:989230222195:web:59fbfeaa5c6e64e6045306"
  };

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);