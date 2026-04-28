"use client"

import styles from "./page.module.css"
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { useRouter } from 'next/navigation'

const SettingsPage = () => {

  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const tier = useSelector((state: RootState) => state.subscription.tier);
  const isAuthLoading = useSelector((state: RootState) => state.auth.loading);
  const isGuest = user?.isAnonymous;

  // if (isGuest) {
  //   return (
  //     <div className={styles["container"]}>
  //       <div className={styles["row"]}>

  //       </div>
  //     </div>
  //   )
  // }
        
  return (
    <div className={styles["container"]}>
        <div className={styles["row"]}>
          <div className={styles["settings__title"]}>Settings</div>

          <div className={styles["settings__content"]}>
            <div className={styles["settings__info"]}>
              <div className={styles["settings__subtitle"]}>Subscription Plan</div>
              <div 
                className={`
                  ${styles["settings__text"]} 
                  ${styles["display__tier"]}
                `}
              >
                {isGuest ? "Basic" : tier}
              </div>
            </div>
            <div className={styles["settings__button--wrapper"]}>
              <button 
                className={styles["settings_button"]} 
                onClick={() => router.push("/choose-plan")}
              >
                Manage Plan
              </button>
            </div>
          </div>

          <div className={styles["settings__content"]}>
            <div className={styles["settings__info"]}>
              <div className={styles["settings__subtitle"]}>Email</div>
              <div className={styles["settings__text"]}>{isGuest ? "Guest" : user?.email}</div>
            </div>
            <div className={styles["settings__button--wrapper"]}>
              <button 
                className={styles["settings_button"]} 
                onClick={() => console.log("Update Email")}
              >
                Update Email
              </button>
            </div>
          </div>
          
        </div>
    </div>
  )
}

export default SettingsPage