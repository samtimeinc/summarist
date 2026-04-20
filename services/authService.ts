
import { auth } from "@/lib/firebase/firebase";
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInAnonymously,
    signOut,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence, 
  } from "firebase/auth";

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

  export function getErrorMessage(error: any): string {
    if (!error) {
      return "An unknown error occurred"
    }

    const errorCode = error.code;

    switch (errorCode) {
      case "auth/invalid-email":
        return "Email address is not valid.";
      case "auth/user-disabled":
        return "This user account has been disabled.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "An account with the email is already in use.";
      case "auth/weak-password":
        return "Password is too weak.";
      case "auth/invalid-credential":
        return "Check your email and password then try again.";
      case "auth/popup-closed-by-user":
        return "Popup was closed. Login cancelled.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
      case "auth/internal-error":
        return "A temporary server error occurred. Please try again later.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment before trying again.";
      case "auth/requires-recent-login":
        return "For security, please log in again before performing this action.";
      default:
        return error.message || "Something went wrong. Please try again."
    }
  }

