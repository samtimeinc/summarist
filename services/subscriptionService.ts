import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, onSnapshot, setDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { Subscription, subscriptionTier } from "@/types/subscription";
import { STRIPE_PRICES } from "@/lib/constants/stripe";




export const fetchUserSubscription = async (userId: string): Promise<subscriptionTier> => {
    try {
        const q = query(
            collection(db, "customers", userId, "subscriptions"),
            where("status", "in", ["active", "trialing"]),
            limit(1)
        );
        
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            const priceId = data.items[0].price.id;

            if (priceId === STRIPE_PRICES.YEARLY) {
                return "premium-plus";
            }

            if (priceId === STRIPE_PRICES.MONTHLY) {
                return "premium";
            }
        }
        return "basic";
    } catch (error) {
        console.error("Error fetching subscription: ", error);
        return "basic";
    }
};



export const setUserSubscription = async (
    userId: string, 
    data: any 
): Promise<void> => {
    try {
        console.warn("Manual subscription setting is usually handled by Stripe webhooks.");
    } catch (error) {
        console.error("Error setting subscription: ", error);
        throw error;
    }
};



export const subscribeToSubscription = (
    userId: string, 
    onUpdate: (tier: subscriptionTier) => void
) => {
    const subscriptionRef = collection(db, "customers", userId, "subscriptions");

    const q = query(
        subscriptionRef, 
        where("status", "in", ["active", "trialing"]), 
        limit(1)
    );

    return onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            onUpdate("basic");
            return;
        }

        const subscriptionData = snapshot.docs[0].data();
        const priceId = subscriptionData.items[0].price.id;

        if (priceId === STRIPE_PRICES.YEARLY) {
            onUpdate("premium-plus");
        } else if (priceId === STRIPE_PRICES.MONTHLY) {
            onUpdate("premium");
        } else {
            onUpdate("basic");
        }
    });
};