import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAi_fiE2GelPCjxKrJ6I4_jX8z2JTvMYc0",
    authDomain: "planter-57e60.firebaseapp.com",
    projectId: "planter-57e60",
    storageBucket: "planter-57e60.firebasestorage.app",
    messagingSenderId: "46110801394",
    appId: "1:46110801394:web:7cb872daabba6e888cff6b",
    measurementId: "G-KWN0P96NL0"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
  
export default app;