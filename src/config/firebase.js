import firebase from "firebase/app";
import "firebase/database";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB7xJ4n9MRAqjY2sXbpXNb3Z94OnItBmgs",
  authDomain: "swf2023-memorachain.firebaseapp.com",
  projectId: "swf2023-memorachain",
  storageBucket: "swf2023-memorachain.appspot.com",
  messagingSenderId: "1009805270709",
  appId: "1:1009805270709:web:00fc601bf5fae6da7f28fc",
  measurementId: "G-MLFEX7NR97",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default database;
