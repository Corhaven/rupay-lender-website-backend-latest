// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUZfllU9leKGXQgkWVpq07S3oZ645PCPc",
  authDomain: "rupay-lender.firebaseapp.com",
  projectId: "rupay-lender",
  storageBucket: "rupay-lender.appspot.com",
  messagingSenderId: "591464279618",
  appId: "1:591464279618:web:ae2946a54c2c6f7486c7db",
  measurementId: "G-MB5M875CBY"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig);
const messaging = firebase.messaging();
 
module.exports = {messaging}