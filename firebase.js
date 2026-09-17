// Firebase App
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

// Firebase Authentication
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// Firebase Firestore
import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsIurfaX-DrD8syWlGvhRh3jnJXBe2NoA",
    authDomain: "nelson-df8bb.firebaseapp.com",
    projectId: "nelson-df8bb",
    storageBucket: "nelson-df8bb.firebasestorage.app",
    messagingSenderId: "491226080583",
    appId: "1:491226080583:web:2a6d7d27635f4cac159862",
    measurementId: "G-PC67DR4D1G"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Authentication
const auth = getAuth(app);


// Initialize Firestore
const db = getFirestore(app);


// Export everything needed by our website
export {
    auth,
    db,

    // Authentication
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,

    // Firestore
    doc,
    getDoc,
    setDoc
};