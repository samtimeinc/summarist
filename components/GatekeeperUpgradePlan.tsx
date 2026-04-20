"use client"

import styles from "@/styles/gatekeeper.module.css"

import ChoosePlanSVG from "./ChoosePlanSVG"

const UpgradePlan = () => {
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
          <div className={styles["option__title"]}>Upgrade to Premium</div>
          <div className={styles["option__buttons"]}>
            <div className={styles["option__button--wrapper"]}>
              <div className={styles["options__button--price"]}>Premium</div>
              <button className={styles["option__button"]}>Monthly</button>
            </div>

            <div className={styles["option__button--wrapper"]}>
              <div className={styles["options__button--price"]}>Premium-Plus</div>
              <button className={styles["option__button"]}>Yearly</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default UpgradePlan