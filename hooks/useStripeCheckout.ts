import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { addToast } from "@/lib/redux/toastSlice";
import { createCheckoutSession } from "@/services/stripeServices";
import { STRIPE_PRICES, StripePriceKey } from "@/lib/constants/stripe";



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

        if (!priceId) {
            console.error("Invalid Price ID configuration");
            return;
        }

        setIsLoading(true);
        try {
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

    return { startCheckout, isLoading };
};