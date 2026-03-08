import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCYB78zQpzqjPygjXsq3S-XRyVf7NgpbPk",
  authDomain: "valley-mountain-17e46.firebaseapp.com",
  projectId: "valley-mountain-17e46",
  storageBucket: "valley-mountain-17e46.firebasestorage.app",
  messagingSenderId: "26821987971",
  appId: "1:26821987971:web:af22efa13ff5503dfd55b6",
  measurementId: "G-5887NPEYQ1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };
