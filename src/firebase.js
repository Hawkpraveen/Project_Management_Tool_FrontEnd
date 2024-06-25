// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "project-management-tool-15b62.firebaseapp.com",
  projectId: "project-management-tool-15b62",
  storageBucket: "project-management-tool-15b62.appspot.com",
  messagingSenderId: "614974408727",
  appId: "1:614974408727:web:c735b19565965c085f7452"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);