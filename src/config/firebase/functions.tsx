import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateCurrentUser,
  updateProfile,
} from "firebase/auth";
import { auth, db, storage } from ".";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as ImageManipulator from "expo-image-manipulator";

type signUp = (
  email: string,
  password: string,
  fullName: string
) => Promise<void>;

const signUp = async (email: string, password: string) => {
  const currentUser = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const ref = doc(db, "users", currentUser.user.uid);
  return await setDoc(ref, {
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

type uploadImage = (imageReferenceID: any, uri: any) => Promise<void>;

const uploadImage = async (imageReferenceID: any, uri: any) => {
  if (uri) {
    const result = await ImageManipulator.manipulateAsync(uri, [], {
      compress: 1,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    const response = await fetch(result.uri);
    const blob = await response.blob();
    const storageRef = ref(storage, imageReferenceID);
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  }
  return null;
};

type createProfile = (
  name: string,
  photoUrl: string,
  dateOfBirth: Date,
  type: string
) => Promise<void>;

const createProfile = async (
  name: string,
  photoUrl: string,
  dateOfBirth: Date,
  type: string
) => {
  const currentUser = auth.currentUser;
  await updateProfile(currentUser, {
    displayName: name,
  });
  const ref = doc(db, "users", currentUser.uid);
  photoUrl = await uploadImage(`profile/${currentUser.uid}`, photoUrl);
  return await setDoc(
    ref,
    {
      name,
      profilePic: photoUrl,
      dateOfBirth,
      type,
    },
    {
      merge: true,
    }
  );
};

export { signUp, signIn, forgotPassword, uploadImage, createProfile };
