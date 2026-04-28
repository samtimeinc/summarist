import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { addToast } from "@/lib/redux/toastSlice";
import { createCheckoutSession } from "@/services/stripeServices";
import { STRIPE_PRICES, StripePriceKey } from "@/lib/constants/stripe";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";



export const useStripeCheckout = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch<AppDispatch>();
    const isGuest = user?.isAnonymous;

    const startCheckout = async (planKey: StripePriceKey) => {
        const priceId = STRIPE_PRICES[planKey];

        if (!user || isGuest) {
            dispatch(addToast({
                title: "Account Required",
                message: "Please sign in to upgrade your account.",
                type: "info",
            }));
            return;
        }

        setIsLoading(true);
        try {
            if (!priceId) {
                throw new Error("Invalid Price ID configuration. Check .env file");
            }
            await createCheckoutSession(user.uid, priceId);
        } catch (error: any) {
            dispatch(addToast({
                title: "Payment Error",
                message: error.message || "Couldn't initiate checkout.",
                type: "error",
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const redirectToCustomerPortal = async (userId: string) => {
        setIsLoading(true);
        try {
            const portalSessionRef = await addDoc(
                collection(db, "customers", userId, "portal_sessions"),
                {
                    return_url: window.location.origin + "settings",
                }
            );

            onSnapshot(portalSessionRef, (snap) => {
                const data = snap.data();
                if (data?.url) {
                    window.location.assign(data.url);
                }
                if (data?.error) {
                    console.error("Portal error: ", data.error.message);
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error("Error creating portal session: ", error);
            setIsLoading(false);
        }
    };

    return { startCheckout, redirectToCustomerPortal, isLoading };
};