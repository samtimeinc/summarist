'use client'

import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/redux/store";
import { auth } from "@/lib/firebase/firebase";
import { onIdTokenChanged } from "firebase/auth";
import { initializeAuthPersistence } from "@/services/authService";
import { setUser, clearUser } from "@/lib/redux/userAuthSlice";
import { setSavedBooks, setFinishedBooks, clearBooks } from "@/lib/redux/librarySlice";
import { setSubscription, clearSubscription } from "@/lib/redux/subscriptionSlice";
import { subscribeToSavedLibrary, subscribeToFinishedLibrary } from "@/services/libraryService";
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
                dispatch(setUser(serializableUser));

                if (!user.isAnonymous) {

                    // Real-time Subscription
                    unsubs.push(subscribeToSubscription(user.uid, (subscription) => {
                        dispatch(setSubscription(subscription));
                    }));
                    
                } else {
                    dispatch(setSubscription({ 
                        tier: "basic", 
                        expires: null, 
                        cancelRenew: false, 
                    }));
                }

                // Real-time saved books list
                unsubs.push(subscribeToSavedLibrary(user.uid, (books) => {
                    dispatch(setSavedBooks(books));
                }));

                // Real-time finished books list
                unsubs.push(subscribeToFinishedLibrary(user.uid, (books) => {
                    dispatch(setFinishedBooks(books));
                }))

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