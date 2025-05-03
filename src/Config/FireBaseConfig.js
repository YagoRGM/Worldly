// Importa o que realmente vai usar
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configurações do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUYBuPQ7Vv8zuPI1-K2z47u2SsbsK-cs8",
  authDomain: "mapaturisticoapp.firebaseapp.com",
  databaseURL: "https://mapaturisticoapp-default-rtdb.firebaseio.com",
  projectId: "mapaturisticoapp",
  storageBucket: "mapaturisticoapp.appspot.com", // Arrumei aqui também (tava errado)
  messagingSenderId: "81133913740",
  appId: "1:81133913740:web:0ea8202393719098571da9",
  measurementId: "G-PK33JWFDX7",
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Inicializa os serviços que vai usar
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exporta para usar nas telas
export { auth, db, storage };
