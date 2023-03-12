import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateCurrentUser,
  updateProfile,
} from "firebase/auth";
import { auth, db } from ".";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

type signUp = (
  email: string,
  password: string,
  fullName: string
) => Promise<void>;

const signUp = async (email: string, password: string, fullName: string) => {
  const currentUser = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await updateProfile(currentUser.user, {
    displayName: fullName,
  });
  const ref = doc(db, "users", currentUser.user.uid);
  return await setDoc(ref, {
    fullName,
    email,
  });
};

type signIn = (email: string, password: string) => Promise<void>;

const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

type forgotPassword = (email: string) => Promise<void>;

const forgotPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};

export { signUp, signIn, forgotPassword };
