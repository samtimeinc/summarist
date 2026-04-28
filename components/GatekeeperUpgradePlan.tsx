"use client"

import styles from "@/styles/gatekeeper.module.css"
import { useState } from "react"
import { useStripeCheckout } from "@/hooks/useStripeCheckout"
import LoadingAnimation from "./LoadingAnimation"

import ChoosePlanSVG from "./ChoosePlanSVG"

const UpgradePlan = () => {
  const [loadingMode, setLoadingMode] = useState<string>("");

  const { startCheckout } = useStripeCheckout();

  

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
                onClick={() => {
                  setLoadingMode("premium"),
                  startCheckout("MONTHLY");
                }}
              >
                {loadingMode === "premium" ? 
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
                onClick={() => {
                  setLoadingMode("premium-plus");
                  startCheckout("YEARLY");
                }}
              >
                {loadingMode === "premium-plus" ? 
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