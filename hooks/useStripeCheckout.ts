import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { addToast } from "@/lib/redux/toastSlice";
import { createCheckoutSession } from "@/services/stripeServices";
import { STRIPE_PRICES, StripePriceKey } from "@/lib/constants/stripe";
import { db, functions } from "@/lib/firebase/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from 'firebase/functions';



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

    const redirectToCustomerPortal = async () => {
        setIsLoading(true);
        
        try {
            const createPortalLink = httpsCallable<{ returnUrl: string }, { url: string }>(
                functions,
                "ext-firestore-stripe-payments-createPortalLink"
            );
            const { data } = await createPortalLink({
                returnUrl: window.location.origin + "/settings",
            });

            window.location.assign(data.url);
        } catch (error: any) {
            console.error("Portal Error: ", error);
            dispatch(addToast({
                title: "Error",
                message: "Could not open billing portal. Please try again.",
                type: "error",
            }))
        } finally {
            setIsLoading(false);
        }
    };

    return { startCheckout, redirectToCustomerPortal, isLoading };
};