"use client"

import styles from "@/styles/gatekeeper.module.css"
import { useState } from "react"
import { useStripeCheckout } from "@/hooks/useStripeCheckout"
import LoadingAnimation from "./LoadingAnimation"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"

import ChoosePlanSVG from "./ChoosePlanSVG"
import { StripePriceKey } from "@/lib/constants/stripe"

const UpgradePlan = () => {
  const [loadingMode, setLoadingMode] = useState<string>("");

  const { startCheckout, redirectToCustomerPortal } = useStripeCheckout();
  const tier = useSelector((state: RootState) => state.subscription.tier);

  const handleCheckout = (planKey: StripePriceKey, loadingKey: string) => {
    setLoadingMode(loadingKey)
    if (tier !== "basic") {
        const confirmManage = window.confirm(
            "You are a current subscriber. Manage your plan on Stripe"
        );
        if (confirmManage) {
          redirectToCustomerPortal();
          setLoadingMode("");
        }
        setLoadingMode("");
        return;
    }
    startCheckout(planKey);
    setLoadingMode("");
};

  

  return (
    <div className={styles["container"]}>
    <div className={styles["row"]}>
      <div className={styles["gatekeeper__headline"]}>
        Great books are waiting on Summarist!
      </div>

      <div className={styles["gatekeeper__options--wrapper"]}>
        <div className={styles["gatekeeper__option"]}>
          <figure className={styles["option__image--wrapper"]}>
            <ChoosePlanSVG />
          </figure>
          <div className={styles["option__intro"]}>Access all of Summarist</div>
          <div className={styles["option__title"]}>Upgrade to a Premium Plan</div>
          <div className={styles["option__buttons"]}>
            <div className={styles["option__button--wrapper"]}>
              <div className={styles["options__button--plan"]}>Premium</div>
              <div className={styles["options__button--price"]}>$5/month</div>
              <button 
                className={styles["option__button"]} 
                disabled={!!loadingMode} 
                onClick={() => handleCheckout("MONTHLY", "premium")}
              >
                {
                  loadingMode === "premium" ? 
                    <LoadingAnimation 
                      fontSize={24} 
                      color="#032b41" 
                    /> : 
                    "Select"
                }
              </button>
            </div>

            <div className={styles["option__button--wrapper"]}>
              <div className={styles["options__button--plan"]}>Premium-Plus</div>
              <div className={styles["options__button--price"]}>$50/year</div>
              <button 
                className={styles["option__button"]} 
                disabled={!!loadingMode}
                onClick={() => handleCheckout("YEARLY", "premium-plus")}
              >
                {
                  loadingMode === "premium-plus" ? 
                    <LoadingAnimation 
                      fontSize={24} 
                      color="#032b41" 
                    /> : 
                    "Select"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default UpgradePlan