// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-analytics.js";
 import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDlxzU37HxLmGGbF2l6K5bYOVS3_mVHuKE",
    authDomain: "essazlife-world.firebaseapp.com",
    projectId: "essazlife-world",
    storageBucket: "essazlife-world.firebasestorage.app",
    messagingSenderId: "504465166626",
    appId: "1:504465166626:web:756024beebf9c8f224d57b",
    measurementId: "G-8B4XXJ9HTF"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const db = getFirestore(app);

 window.essazFirebase = {
    auth,
    db,
    googleProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
    doc,
    setDoc,
    getDoc
};

console.log("ESSAzLife World: Firebase connected!", {
    authReady: !!auth,
    firestoreReady: !!db
});

window.essazFirebase.signInWithGoogle = async function () {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
};

window.essazFirebase.testCloudStorage = async function () {
    const user = auth.currentUser;

    if (!user) {
        console.log("Cloud test: Sign in with Google first.");
        return;
    }

    const testRef = doc(db, "users", user.uid, "tests", "connection");

    await setDoc(testRef, {
        message: "MooCow says hello!",
        testOnly: true
    });

    const snapshot = await getDoc(testRef);

    console.log("Cloud test successful:", snapshot.data());
};