import { db } from "@/lib/firebase/firebase";
import { doc,getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { Subscription, subscriptionTier } from "@/types/subscription";




export const fetchUserSubscription = async (userId: string): Promise<subscriptionTier> => {
    try {
        const docRef = doc(db, "subscriptions", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().tier ?? null;
        }
        return "free";
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return "free";
    }
};



export const ensureSubscriptionExists = async (userId: string): Promise<void> => {
    try {
        const docRef = doc(db, "subscriptions", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                tier: "free" as subscriptionTier,
                stripeCustomerId: null,
                stripeSubscriptionId: null
            });
            console.log("Subscription record initialized for user: ", userId);
        }
    } catch (error) {
        console.error("Error initializing subscription: ", error);
    }
};



export const setUserSubscription = async (userId: string, data: Partial<Subscription>): Promise<void> => {
    try {
        const docRef = doc(db, "subscriptions", userId);
        await setDoc(docRef, data, {merge: true});
    } catch (error) {
        console.error("Error setting subscription:", error);
        throw error;
    }
};



export const subscribeToSubscription = (userId: string, onUpdate: (tier: subscriptionTier) => void) => {
    const docRef = doc(db, "subscriptions", userId);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            onUpdate(docSnap.data().tier ?? null);
        } else {
            onUpdate("free");
        }
    });
};