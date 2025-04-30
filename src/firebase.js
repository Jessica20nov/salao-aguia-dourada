import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCs0nHUefHol_WEdBI8-6nkSDt5AiQakVA",
  authDomain: "pi-salao.firebaseapp.com",
  projectId: "pi-salao",
  storageBucket: "pi-salao.firebasestorage.app",
  messagingSenderId: "636762067042",
  appId: "1:636762067042:web:28b8f5af980f35e46b013b",
  measurementId: "G-EXZPZ5D55E"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }; // <- múltiplos exports nomeados