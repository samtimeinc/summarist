'use client'

import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/redux/store";
import { auth } from "@/lib/firebase/firebase";
import { onIdTokenChanged } from "firebase/auth";
import { initializeAuthPersistence } from "@/services/authService";
import { setUser, clearUser } from "@/lib/redux/userAuthSlice";
import { setBooks, clearBooks } from "@/lib/redux/librarySlice";
import { setSubscription, clearSubscription } from "@/lib/redux/subscriptionSlice";
import { subscribeToLibrary } from "@/services/libraryService";
import { subscribeToSubscription } from "@/services/subscriptionService";
import { setAuthCookie, removeAuthCookie } from "@/lib/actions/auth-actions";
import { SerializableUser } from "@/types/serializableUser";

const AuthListener = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        let isMounted = true;
        let unsubs: (() => void)[] = [];
        initializeAuthPersistence();

        const authUnsubscribe = onIdTokenChanged(auth, async (user) => {
            // If user changes, clean up old listeners
            unsubs.forEach(unsub => unsub());
            unsubs = [];

            if (user) {
                // Token management for middleware
                const token = await user.getIdToken();
                if (!isMounted) {
                    return;
                }
                await setAuthCookie(token);

                const serializableUser: SerializableUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    isAnonymous: user.isAnonymous,
                }
                // dispatch(setUser(user));
                dispatch(setUser(serializableUser));

                // Real-time Library
                unsubs.push(subscribeToLibrary(user.uid, (books) => {
                    dispatch(setBooks(books));
                }));

                // Real-time Subscription
                unsubs.push(subscribeToSubscription(user.uid, (tier) => {
                    dispatch(setSubscription(tier));
                }));

            } else {
                await removeAuthCookie();
                dispatch(clearUser());
                dispatch(clearBooks());
                dispatch(clearSubscription());
            }
        });

        return () => {
            isMounted = false;
            authUnsubscribe();
            unsubs.forEach(unsub => unsub());
        };
    }, [dispatch]);

    return null;
};
export default AuthListener;