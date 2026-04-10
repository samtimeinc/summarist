"use client"


import styles from "@/styles/gatekeeper.module.css"
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useAuthModal } from '@/context/AuthModalContext'
import { logoutUser } from '@/services/authService'
import { addToast } from '@/lib/redux/toastSlice'
import Skeleton from "./Skeleton"

import ChoosePlanSVG from './ChoosePlanSVG'
import CreateAccountSVG from './CreateAccountSVG'

interface GatekeeperProp {
  id?: string;  // If id is true, user is logged in
  isGuest?: boolean; // If isGuest is true, user is logged in on a guest account. Prohibited from premium tier
  isSubscriptionLoading?: boolean;
  isAuthLoading?: boolean; 
}



const Gatekeeper = ({ id, isGuest, isSubscriptionLoading, isAuthLoading }: GatekeeperProp) => {
  const isRegisteredUser = id && !isGuest;
  const router = useRouter();
  const { openModalWithRedirect } = useAuthModal();
  const dispatch = useDispatch();



  const handleCreateAccount = async (): Promise<void> => {
    try {
      if (id) {
        await logoutUser();
      }
      openModalWithRedirect('/settings', true);
    } catch (error) {
      console.error('Error upgrading the account:', error);
      dispatch(addToast({ title: "Error", message: "Error upgrading the account.", type: "error" }));
    }
  };

  // if (isSubscriptionLoading || isAuthLoading) {
  //   return (
  //     <div className={styles["container"]}>
  //     <div className={styles["row"]}>
  //       <div className={styles["gatekeeper__title"]}>
  //         <Skeleton height="33px"width="400px" />
  //       </div>
  //       <div className={styles["gatekeeper__options--wrapper"]}>
  //         <Skeleton width="400px" height="420px" />
  //       </div>
  //     </div>
  //   </div>
  //   )
  // }

  return (

    <div className={styles["container"]}>
      <div className={styles["row"]}>
        <div className={styles["gatekeeper__headline"]}>
          Great books are waiting. Sign up today and go Premium!
        </div>
        <div className={styles["gatekeeper__options--wrapper"]}>
          <div className={styles["gatekeeper__create--wrapper"]} onClick={() => handleCreateAccount()} >
            <figure className={styles["options__image--wrapper"]}>
              <CreateAccountSVG />
            </figure>
            <div className={styles["options__intro"]}>Forget guest accounts</div>
            <div className={styles["options__title"]}>Sign up for Summarist</div>
          </div>
          
            <div className={styles["gatekeeper__tier--wrapper"]} onClick={() => router.push("/settings")} >
              <figure className={styles["options__image--wrapper"]}>
                <ChoosePlanSVG />
              </figure>
              <div className={styles["options__intro"]}>Access all of Summarist</div>
              <div className={styles["options__title"]}>Upgrade to Premium</div>
            </div>
          
        </div>
      </div>
    </div>

  )
}

export default Gatekeeper