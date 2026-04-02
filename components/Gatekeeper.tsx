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

  return (
    <>
    <div className={styles["container"]}>
      <div className={styles["row"]}>
        <div className={styles["gatekeeper__title"]}>
          {isSubscriptionLoading || isAuthLoading ? (
            <Skeleton height="33px"width="400px" />
          ) : (
            isRegisteredUser ? "Great books are waiting" : "Sign up today and go Premium!"
          )}
        </div>
        <div className={styles["gatekeeper__options--wrapper"]}>

          {/* User is logged in as guest or somehow finds this page without first logging in.*/}
          {isSubscriptionLoading || isAuthLoading ? (
            <Skeleton width="400px" height="420px" />
          ) : (
            !isRegisteredUser &&  
              (<div className={styles["gatekeeper__create--wrapper"]} onClick={() => handleCreateAccount()} >
                <figure className={styles["options__image--wrapper"]}>
                  <CreateAccountSVG />
                </figure>
                <div className={styles["options__title"]}>Create an account</div>
              </div>)
          )}

          {/* User is logged in but not a guest. User is not a premium subscriber */}

          {isRegisteredUser && 
            <div className={styles["gatekeeper__tier--wrapper"]} onClick={() => router.push("/settings")} >
              <figure className={styles["options__image--wrapper"]}>
                <ChoosePlanSVG />
              </figure>
              <div className={styles["options__title"]}>Upgrade to Premium</div>
            </div>
          }
        </div>
      </div>
    </div>
    </>
  )
}

export default Gatekeeper