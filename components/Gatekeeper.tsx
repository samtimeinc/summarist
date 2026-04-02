"use client"

import React, { useEffect, useState } from 'react'
import styles from "@/styles/gatekeeper.module.css"
import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '@/lib/redux/store'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthModal } from '@/context/AuthModalContext'
import { logoutUser } from '@/services/authService'
import { addToast } from '@/lib/redux/toastSlice'


// import LoginSVG from './LoginSVG'
import ChoosePlanSVG from './ChoosePlanSVG'
import CreateAccountSVG from './CreateAccountSVG'

interface GatekeeperProp {
  isBookPremium?: boolean;
  id?: string;  // If id is true, user is logged in
  isGuest?: boolean; // If isGuest is true, user is logged in on a guest account. Prohibited from premium tier
}



const Gatekeeper = ({ isBookPremium, id, isGuest }: GatekeeperProp) => {
  const [showUpgradeToPremium, setShowUpgradeToPremium] = useState<boolean>(false);

  const router = useRouter();
  const pathName = usePathname();
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

  useEffect(() => {
    if (id && !isGuest) {
        setShowUpgradeToPremium(true);
    }
  }, [])

  return (
    <>
    <div className={styles["container"]}>
      <div className={styles["row"]}>
        <div className={styles["gatekeeper__title"]}>
          {!showUpgradeToPremium ? "Guests cannot view premium content" : "Premium plan required" }
          </div>
        <div className={styles["gatekeeper__options--wrapper"]}>

          {/* User is logged in as guest or somehow finds this page without first logging in.*/}
          {!showUpgradeToPremium && 
            <div className={styles["gatekeeper__create--wrapper"]} onClick={() => handleCreateAccount()} >
              <figure className={styles["options__image--wrapper"]}>
                <CreateAccountSVG />
              </figure>
              <div className={styles["options__title"]}>Create an account</div>
          </div>
          }

          {/* User is logged, User is not a guest, and user is not a premium subscriber */}
          { showUpgradeToPremium && 
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