'use client'

import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/redux/store";
import { auth } from "@/lib/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { initializeAuthPersistence } from "@/services/authService";
import { setUser, clearUser } from "@/lib/redux/userAuthSlice";
import { setBooks, clearBooks } from "@/lib/redux/librarySlice";
import { setSubscription, clearSubscription } from "@/lib/redux/subscriptionSlice";
import { subscribeToLibrary } from "@/services/libraryService";
import { subscribeToSubscription } from "@/services/subscriptionService";

const AuthListener = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        let unsubs: (() => void)[] = [];

        initializeAuthPersistence();

        const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
            // If user changes, clean up old listeners
            unsubs.forEach(unsub => unsub());
            unsubs = [];

            if (user) {
                // Token management for middleware
                const token = await user.getIdToken(true);
                document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Strict`;
                dispatch(setUser(user));

                // Real-time Library
                unsubs.push(subscribeToLibrary(user.uid, (books) => {
                    dispatch(setBooks(books));
                }));

                // Real-time Subscription
                unsubs.push(subscribeToSubscription(user.uid, (tier) => {
                    dispatch(setSubscription(tier));
                }));

            } else {
                document.cookie = "firebase-auth-token=; path=/; max-age=0";
                dispatch(clearUser());
                dispatch(clearBooks());
                dispatch(clearSubscription());
            }
        });

        // Token Refresh
        const refreshInterval = setInterval(async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const token = await currentUser.getIdToken(true);
                document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Strict`;
            }
        }, 55 * 60 * 1000);

        return () => {
            authUnsubscribe();
            clearInterval(refreshInterval);
            unsubs.forEach(unsub => unsub());
        };
    }, [dispatch]);

    return null;
};
export default AuthListener;