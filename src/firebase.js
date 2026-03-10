import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAKYiySqXK0iWHUjt96fB5vaxzYir_0u_E",
  authDomain: "railconnect-89ce9.firebaseapp.com",
  projectId: "railconnect-89ce9",
  storageBucket: "railconnect-89ce9.firebasestorage.app",
  messagingSenderId: "301210208571",
  appId: "1:301210208571:web:07c029f76f605b5c9acf1e",
  measurementId: "G-3TCRV8LM97"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app