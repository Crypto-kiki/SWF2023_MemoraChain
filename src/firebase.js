// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const FIREBASE_API = process.env.REACT_APP_FIREBASE_API;
const FIREBASE_APP_ID = process.env.REACT_APP_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: FIREBASE_API,
  authDomain: "swf2023-memorachain.firebaseapp.com",
  projectId: "swf2023-memorachain",
  storageBucket: "swf2023-memorachain.appspot.com",
  messagingSenderId: "1009805270709",
  appId: FIREBASE_APP_ID,
  measurementId: "G-MLFEX7NR97",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
