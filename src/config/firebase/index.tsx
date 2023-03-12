import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC4GuIGao0p4RhmfjaoT7HC5Exn5i2QNh0",
  authDomain: "mobius-58a6b.firebaseapp.com",
  projectId: "mobius-58a6b",
  storageBucket: "mobius-58a6b.appspot.com",
  messagingSenderId: "616352848716",
  appId: "1:616352848716:web:b393da9cfc7924030ecde9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
