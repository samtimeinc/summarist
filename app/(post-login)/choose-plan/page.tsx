"use client"

import styles from "./page.module.css"
import { RootState, AppDispatch } from '@/lib/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { addToast } from "@/lib/redux/toastSlice"
import { useStripeCheckout } from "@/hooks/useStripeCheckout"
import { StripePriceKey } from "@/lib/constants/stripe"
import LoadingAnimation from "@/components/LoadingAnimation"
import Skeleton from "@/components/Skeleton"



const ChoosePlanPage = () => { 
    const user = useSelector((state: RootState) => state.auth.user);
    const tier = useSelector((state: RootState) => state.subscription.tier);
    const expires = useSelector((state: RootState) => state.subscription.expires);
    const cancelRenew = useSelector((state: RootState) => state.subscription.cancelRenew);
    const isTierLoading = useSelector((state: RootState) => state.subscription.loading);
    const dispatch = useDispatch<AppDispatch>();
    const { startCheckout, redirectToCustomerPortal, isLoading } = useStripeCheckout();

    console.log(cancelRenew)

    const formatRenewalDate = (timestamp: number | null) => {
        if (!timestamp) {
            return "";
        }
        return new Date(timestamp * 1000).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });
    };

    const displayPremiumPrice = () => {
        return "$5/month";
    }

    const displayPremiumPlusPrice = () => {
        return "$50/year";
    }

    const displaySelect = () => {
        return "Select";
    }

    const handleCancelPlan = () => {
        console.log("Cancel Plan");
        if (tier !== "basic" && user) {
            const confirmCancel = window.confirm(
                `Cancel ${tier} plan? This will take you to Stripe billing dashboard.`
            );

            if (confirmCancel) {
                redirectToCustomerPortal();
            }
        }
    }

    const handleCheckout = (planKey: StripePriceKey) => {
        console.log(`Stripe checkout ${planKey} initiated`);
        if (tier !== "basic") {
            const confirmManage = window.confirm(
                "You are a current subscriber. Manage your plan on Stripe"
            );
            if (confirmManage) {
                redirectToCustomerPortal();
            }
            return;
        }
        startCheckout(planKey);
    }

  return (
    <div className={styles["container"]}>
        <div className={styles["row"]}>
            <div className={styles["choose__container"]}>
                <div className={styles["choose__options--wrapper"]}>
                    <h2 className={styles["choose__options--title"]}>Manage Subscription</h2>

                    <div className={styles["choose__option"]}>
                        <div className={styles["choose__details"]}>
                            <h3>Current Plan</h3>
                            <div className={styles["choose__user--detail"]}>
                                {
                                    isTierLoading ? 
                                        <Skeleton width="113px" height="20px" /> : 
                                        tier
                                }
                            </div>
                            <div className={styles["choose__user--detail"]}>

                                {isTierLoading ? 
                                    <Skeleton width="141px" height="20px" /> :
                                    (tier !== "basic" && expires) && (
                                        (cancelRenew ?? false) 
                                            ? `Expires ${formatRenewalDate(expires)}` 
                                            : `Renews ${formatRenewalDate(expires)}`
                                    )
                                }
                                
                            </div>
                        </div>
                    </div>

                    <div className={styles["choose__divider"]}></div>

                    <div className={styles["choose__option"]}>
                        <div className={styles["choose__details"]}>
                            <div className={styles["choose__title"]}>
                                {
                                    isTierLoading ? 
                                        (<Skeleton width="209px" height="22px" />) :
                                        (tier === "basic" || cancelRenew) ? 
                                            "Upgrade to Premium" : 
                                            `Cancel ${tier} plan`
                                }
                            </div>
                            <div className={styles["choose__price"]}>
                                {
                                    isTierLoading ? 
                                        (<Skeleton width="169px" height="18px" />) : 
                                        (tier === "basic" || cancelRenew) ? 
                                            displayPremiumPrice() : 
                                            "Return to Basic plan"
                                }
                            </div>
                        </div>
                        {
                            isTierLoading ? 
                                (<Skeleton width="135px" height="48px" borderRadius="4px" />) : 
                                (<button 
                                    className={styles["choose__btn"]}
                                    disabled={isLoading}
                                    onClick={
                                        (tier === "basic" || cancelRenew) ? 
                                            () => handleCheckout("MONTHLY") : 
                                            () => handleCancelPlan()
                                    }
                                >
                                    {(tier === "basic" || cancelRenew) ? 
                                        displaySelect() : 
                                        "Cancel"
                                    }
                                </button>)
                        }
                    </div>

                    <div className={styles["choose__option"]}>
                        <div className={styles["choose__details"]}>
                            <div className={styles["choose__title"]}>
                                {
                                    isTierLoading ? 
                                        (<Skeleton width="209px" height="22px" />) :
                                        (tier === "premium-plus" ? 
                                            "Swith to Premium" : 
                                            "Upgrade to Premium-Plus")
                                }
                            </div>
                            <div className={styles["choose__price"]}>
                                {
                                    isTierLoading ? 
                                        (<Skeleton width="169px" height="18px" />) : 
                                        (tier === "premium-plus" ? 
                                            displayPremiumPrice() : 
                                            displayPremiumPlusPrice())
                                }
                            </div>
                        </div>
                        {
                            isTierLoading ? 
                                (<Skeleton width="135px" height="48px" borderRadius="4px" />) : 
                                (<button 
                                    className={styles["choose__btn"]}
                                    disabled={isLoading}
                                    onClick={
                                        tier === "premium-plus" ? 
                                            () => handleCheckout("MONTHLY") : 
                                            () => handleCheckout("YEARLY")
                                    }
                                >
                                    {displaySelect()}
                                </button>)
                        }
                    </div>

                    <div className={styles["choose__payment"]}>
                        {isLoading && 
                            <LoadingAnimation 
                                message="Connecting to Stripe..." 
                                fontSize={48} 
                                color="#032b41" 
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChoosePlanPage