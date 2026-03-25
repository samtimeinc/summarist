import { db } from "@/lib/firebase/firebase";
import { doc,getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { subscriptionTier } from "@/types/subscription";



export const fetchUserSubscription = async (userId: string): Promise<subscriptionTier> => {
    try {
        const docRef = doc(db, "subscriptions", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().tier ?? null;
        }
        return null;
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return null;
    }
};



export const setUserSubscription = async (userId: string, tier: subscriptionTier): Promise<void> => {
    try {
        const docRef = doc(db, "subscriptions", userId);
        await setDoc(docRef, {tier}, {merge: true});
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
            onUpdate(null);
        }
    });
};