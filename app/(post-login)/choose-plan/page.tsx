"use client"

import styles from "./page.module.css"
import { RootState } from '@/lib/redux/store'
import { useSelector } from 'react-redux'
import { useStripeCheckout } from "@/hooks/useStripeCheckout"

import { FaCheckCircle } from "react-icons/fa";


const ChoosePlanPage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const tier = useSelector((state: RootState) => state.subscription.tier)
    const { startCheckout, isLoading } = useStripeCheckout();

  return (
    <div className={styles["container"]}>
        <div className={styles["row"]}>
            <div className={styles["choose__container"]}>
                <div className={styles["choose__options--wrapper"]}>
                    <h2 className={styles["choose__options--title"]}>Manage Plan</h2>
                    <div className={styles["choose__option"]}>
                        <div className={styles["choose__details"]}>
                            <div className={styles["choose__title"]}>Basic</div>
                            <div className={styles["choose__price"]}>Free</div>
                        </div>
                        <button 
                            className={styles[`
                                ${tier === "basic" || "free" ? 
                                    "current__plan" : "choose__btn"}
                                `
                            ]}
                        >
                            {isLoading ? 
                                ("Processing...") : 
                                (tier === "basic" || "free" ? 
                                    <FaCheckCircle/> : "Choose"
                                )
                            }
                        </button>
                    </div>
                    <div className={styles["choose__option"]}>
                        <div className={styles["choose__details"]}>
                            <div className={styles["choose__title"]}>Premium</div>
                            <div className={styles["choose__price"]}>$5/month</div>
                        </div>
                        <button 
                            className={styles[`
                                ${tier === "premium" ? 
                                    "current__plan" :  "choose__btn"
                                }
                            `]}
                            disabled={isLoading} 
                            onClick={() => startCheckout("MONTHLY")}
                        >
                        {isLoading ? 
                            ("Processing...") : 
                            (tier === "premium" ? 
                                <FaCheckCircle/> : "Choose"
                            )
                        }
                        </button>
                    </div>
                    <div className={styles["choose__option"]}>
                        <div className={styles["choose__details"]}>
                            <div className={styles["choose__title"]}>Premium+</div>
                            <div className={styles["choose__price"]}>$50/year</div>
                        </div>
                        <button 
                            className={styles[`
                                ${tier === "premium-plus" ? 
                                    "current__plan" :  "choose__btn"
                                }
                            `]} 
                            disabled={isLoading} 
                            onClick={() => startCheckout("YEARLY")} 
                        >
                        {isLoading ? 
                            ("Processing...") : 
                            (tier === "premium-plus" ?
                                 <FaCheckCircle/> : "Choose"
                            )
                        }
                        </button>
                    </div>
                </div>
            </div>
        
        </div>
    </div>
  )
}

export default ChoosePlanPage