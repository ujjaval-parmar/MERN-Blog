// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// console.log(import.meta.env.VITE_FIREBASE_API_KEY)
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-fd313.firebaseapp.com",
  projectId: "mern-blog-fd313",
  storageBucket: "mern-blog-fd313.appspot.com",
  messagingSenderId: "525424637130",
  appId: "1:525424637130:web:79a3025185c2c992e33033"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);