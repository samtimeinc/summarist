'use client'

import { auth } from "@/lib/firebase/firebase";
import { setUser, clearUser } from "@/lib/redux/userAuthSlice";
import { setBooks, clearBooks } from "@/lib/redux/librarySlice";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { initializeAuthPersistence } from "@/services/authService";
import { fetchUserLibrary } from "@/services/libraryService";

const AuthListener = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const refreshInterval = setInterval(async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const token = await currentUser.getIdToken(true);
                document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Strict`;
            }
        }, 55 * 60 * 1000);

        const initAuth = async () => {
            await initializeAuthPersistence();

            unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
                if (user) {
                    const token = await user.getIdToken(true);
                    document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Strict`;
                    dispatch(setUser(user));

                    const books = await fetchUserLibrary(user.uid);
                    dispatch(setBooks(books));
                } else {
                    document.cookie = "firebase-auth-token=; path=/; max-age=0";
                    dispatch(clearUser());
                    dispatch(clearBooks());
                }
            });
        };

        initAuth();

        return () => {
            clearInterval(refreshInterval);
            if (unsubscribe) {
                unsubscribe();
            }
        }
        
    }, [dispatch]);

    return null;
};
export default AuthListener;