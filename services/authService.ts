import { auth } from "@/lib/firebase/firebase";
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInAnonymously,
    signOut,
    sendPasswordResetEmail
  } from "firebase/auth";
  import { setPersistence, browserLocalPersistence } from "firebase/auth";

  export const initializeAuthPersistence = async (): Promise<void> => {
    await setPersistence(auth, browserLocalPersistence);
  }
  
  const googleProvider = new GoogleAuthProvider();
  export const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  }

  export const loginAsGuest = () => {
    return signInAnonymously(auth);
  }

  export const loginWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  }

  export const registerWithEmail = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  export const passwordReset = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  }

  export const logoutUser = () => {
    return signOut(auth);
  }

  export function throwError(error: unknown) {
    if (error instanceof Error) {
      return error.message
    }
  }