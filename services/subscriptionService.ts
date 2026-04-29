import { db } from "@/lib/firebase/firebase";
import { onSnapshot, collection, query, where, limit, getDocs } from "firebase/firestore";
import { Subscription, subscriptionTier } from "@/types/subscription";
import { STRIPE_PRICES } from "@/lib/constants/stripe";




export const fetchUserSubscription = async (userId: string): Promise<Subscription> => {
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
            const expires = data.current_period_end?.seconds || data.current_period_end || null;
            const cancelRenew = !!data.cancel_at_period_end;

            if (priceId === STRIPE_PRICES.YEARLY) {
                return { tier: "premium-plus", expires, cancelRenew };
            }

            if (priceId === STRIPE_PRICES.MONTHLY) {
                return { tier: "premium", expires, cancelRenew };
            }
        }
        return { tier: "basic", expires: null, cancelRenew: false };
    } catch (error) {
        console.error("Error fetching subscription: ", error);
        return { tier: "basic", expires: null, cancelRenew: false };
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
    onUpdate: (data: { tier: subscriptionTier, expires: number | null, cancelRenew: boolean }) => void
) => {
    const subscriptionRef = collection(db, "customers", userId, "subscriptions");

    const q = query(
        subscriptionRef, 
        where("status", "in", ["active", "trialing"]), 
        limit(1)
    );

    return onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            onUpdate({ tier: "basic", expires: null, cancelRenew: false });
            return;
        }

        const data = snapshot.docs[0].data();
        const priceId = data.items[0].price.id;
        const expires = data.current_period_end?.seconds || data.current_period_end;
        const cancelRenew = !!data.cancel_at_period_end;

        let tier: subscriptionTier = "basic";

        if (priceId === STRIPE_PRICES.YEARLY) {
            tier = "premium-plus";
        } else if (priceId === STRIPE_PRICES.MONTHLY) {
            tier = "premium"
        }
        onUpdate({ tier, expires, cancelRenew });
    });
};