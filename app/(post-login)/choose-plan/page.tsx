"use client"

import styles from "./page.module.css"
import { RootState } from '@/lib/redux/store'
import { useSelector } from 'react-redux'
import { useStripeCheckout } from "@/hooks/useStripeCheckout"
import { StripePriceKey } from "@/lib/constants/stripe"
import LoadingAnimation from "@/components/LoadingAnimation"



const ChoosePlanPage = () => { 
    const user = useSelector((state: RootState) => state.auth.user);
    const tier = useSelector((state: RootState) => state.subscription.tier);
    const expires = useSelector((state: RootState) => state.subscription.expires);
    const { startCheckout, redirectToCustomerPortal, isLoading } = useStripeCheckout();

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
                `Cancel ${tier} plan? This will take you to your billing dashboard.`
            );

            if (confirmCancel) {
                redirectToCustomerPortal(user.uid);
            }
        }
    }

    const handleCheckout = (planKey: StripePriceKey) => {
        console.log(`Stripe checkout ${planKey} initiated`);
        startCheckout(planKey);
    }

  return (
    <div className={styles["container"]}>
        <div className={styles["row"]}>
            <div className={styles["choose__container"]}>
                <div className={styles["choose__options--wrapper"]}>
                    <h2 className={styles["choose__options--title"]}>Manage Plan</h2>

                    <div className={styles["choose__option"]}>
                        <div className={styles["choose__details"]}>
                            <h3>Current Plan</h3>
                            <div className={styles["choose__user--detail"]}>{tier}</div>
                            <div className={styles["choose__user--detail"]}>

                                {
                                    (tier !== "basic" && expires) && 
                                        `Renews ${formatRenewalDate(expires)}`
                                }
                                
                            </div>
                        </div>
                    </div>

                    <div className={styles["choose__divider"]}></div>

                    <div className={styles["choose__option"]}>
                        <div className={styles["choose__details"]}>
                            <div className={styles["choose__title"]}>

                                {tier === "basic" ? 
                                        "Upgrade to Premium" : 
                                        `Cancel ${tier} plan`
                                }
                            </div>
                            <div className={styles["choose__price"]}>

                                {tier === "basic" ? 
                                    displayPremiumPrice() : 
                                    "Return to Basic plan"
                                }
                            </div>
                        </div>
                        <button 
                            className={styles["choose__btn"]}
                            disabled={isLoading}
                            onClick={
                                tier === "basic" ? 
                                    () => handleCheckout("MONTHLY") : 
                                    () => handleCancelPlan()
                            }
                        >
                            {tier === "basic" ? 
                                displaySelect() : 
                                "Cancel"
                            }
                        </button>
                    </div>

                    <div className={styles["choose__option"]}>
                        <div className={styles["choose__details"]}>
                            <div className={styles["choose__title"]}>

                                {tier === "premium-plus" ? 
                                    "Swith to Premium" : 
                                    "Upgrade to Premium-Plus"
                                }
                            </div>
                            <div className={styles["choose__price"]}>

                                {tier === "premium-plus" ? 
                                    displayPremiumPrice() : 
                                    displayPremiumPlusPrice()
                                }
                            </div>
                        </div>
                        <button 
                            className={styles["choose__btn"]}
                            disabled={isLoading}
                            onClick={
                                tier === "premium-plus" ? 
                                    () => handleCheckout("MONTHLY") : 
                                    () => handleCheckout("YEARLY")
                            }
                        >
                            {displaySelect()}
                        </button>
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