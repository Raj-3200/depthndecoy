import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000:web:000",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Create with demo config so the app still renders
  app = initializeApp({
    apiKey: "demo-api-key",
    authDomain: "demo.firebaseapp.com",
    projectId: "demo-project",
    appId: "1:000:web:000",
  }, "fallback");
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
export default app;
