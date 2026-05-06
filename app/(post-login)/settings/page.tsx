"use client"

import styles from "./page.module.css"
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { useRouter } from 'next/navigation'
import { useAuthModal } from "@/context/AuthModalContext"
import Skeleton from "@/components/Skeleton"
import LoginToAccount from "@/components/GatekeeperLogin"



const SettingsPage = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const tier = useSelector((state: RootState) => state.subscription.tier);
  const isTierLoading = useSelector((state: RootState) => state.subscription.loading);
  const isGuest = user?.isAnonymous;
  const { setShowModal }  = useAuthModal();

  if (!user) {
    return <LoginToAccount />
  }
        
  return (
    <div className={styles["container"]}>
        <div className={styles["row"]}>
          <div className={styles["settings__title"]}>Settings</div>

          <div className={styles["settings__content"]}>
            <div className={styles["settings__info"]}>
              <div className={styles["settings__subtitle"]}>Subscription</div>
              <div 
                className={`
                  ${styles["settings__text"]} 
                  ${styles["display__tier"]}
                `}
              >
                {
                  isTierLoading ? 
                    (<Skeleton width="113px" height="20px" />) : 
                    (isGuest ? "Basic" : tier)
                }
              </div>
            </div>
            <div className={styles["settings__button--wrapper"]}>
              {
                isTierLoading ? 
                  (<Skeleton width="170px" height="50px" borderRadius="4px" />) : 
                  (<button 
                    className={styles["settings__button"]} 
                    onClick={() => router.push("/choose-plan")}
                  >
                    Manage Plan
                  </button>)
              }
            </div>
          </div>

          <div className={styles["settings__content"]}>
            <div className={styles["settings__info"]}>
              <div className={styles["settings__subtitle"]}>Email</div>
              <div className={styles["settings__text"]}>
                {
                  isTierLoading ? 
                    (<Skeleton width="240px" height="20px" />) : 
                    (isGuest ? "Guest" : user?.email)
                }
                </div>
            </div>
            <div className={styles["settings__button--wrapper"]}>
              {
                isTierLoading ? 
                  <Skeleton width="170px" height="50px" borderRadius="4px" /> : 
                  user?.isAnonymous ? 
                    <button 
                      className={styles["settings__button"]} 
                      onClick={() => setShowModal(true)}
                    >
                      Register
                    </button> : ""
              }
            </div>
          </div>
          
        </div>
    </div>
  )
}

export default SettingsPage