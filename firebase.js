import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCsIurfaX-DrD8syWlGvhRh3jnJXBe2NoA",
    authDomain: "nelson-df8bb.firebaseapp.com",
    projectId: "nelson-df8bb",
    storageBucket: "nelson-df8bb.firebasestorage.app",
    messagingSenderId: "491226080583",
    appId: "1:491226080583:web:2a6d7d27635f4cac159862",
    measurementId: "G-PC67DR4D1G"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


export {
    app,
    auth,
    db,

    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,

    doc,
    getDoc,
    setDoc
};