// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoutwBXiPr8u8xvqtU7Sr_TN1WerOWie8",
  authDomain: "wreaders-29a5d.firebaseapp.com",
  projectId: "wreaders-29a5d",
  storageBucket: "wreaders-29a5d.appspot.com",
  messagingSenderId: "916537269766",
  appId: "1:916537269766:web:e9ce845dd37a29edd8ad87",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
