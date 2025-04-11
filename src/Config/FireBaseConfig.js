import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUYBuPQ7Vv8zuPI1-K2z47u2SsbsK-cs8",
  authDomain: "mapaturisticoapp.firebaseapp.com",
  databaseURL: "https://mapaturisticoapp-default-rtdb.firebaseio.com",
  projectId: "mapaturisticoapp",
  storageBucket: "mapaturisticoapp.appspot.com",
  messagingSenderId: "81133913740",
  appId: "1:81133913740:web:0ea8202393719098571da9",
  measurementId: "G-PK33JWFDX7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
