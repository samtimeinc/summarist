import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";



export const createCheckoutSession = async (
    userId: string,
    priceId: string,
): Promise<void> => {
    const checkoutSessionRef = await addDoc(
        collection(db, "customers", userId, "checkout_sessions"),
        {
            price: priceId,
            success_url: window.location.origin + "/for-you?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: window.location.origin + "/choose-plan",
        }
    );
    
    return new Promise((resolve, reject) => {
        onSnapshot(checkoutSessionRef, (snap) => {
            const data = snap.data();
            const url = data?.url;
            const error = data?.error;

            if (error) {
                reject(new Error(`Stripe Error: ${error.message}`));
            }
            if (url) {
                window.location.assign(url);
                resolve();
            }
        });
    });
};