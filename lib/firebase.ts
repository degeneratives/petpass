import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBhcpmTkMxNK4Ecxzz4PFHrqiD24rDKONU",
  authDomain: "petpass-xyz.firebaseapp.com",
  projectId: "petpass-xyz",
  storageBucket: "petpass-xyz.firebasestorage.app",
  messagingSenderId: "704970340519",
  appId: "1:704970340519:web:c36b95e2f71948fe4ac382",
  measurementId: "G-5XP1EGW2Y3"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
