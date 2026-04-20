"use client"


import styles from "@/styles/gatekeeper.module.css"
import { useAuthModal } from '@/context/AuthModalContext'

import LoginSVG from "./LoginSVG"



const LoginToAccount = () => {
  const { setShowModal } = useAuthModal();

  return (
    <div className={styles["container"]}>
      <div className={styles["row"]}>
        <div className={styles["gatekeeper__headline"]}>
          Great books are waiting on Summarist!
        </div>
        
        <div className={styles["gatekeeper__options--wrapper"]}>
        <div className={styles["gatekeeper__option"]}>
          <figure className={styles["option__image--wrapper"]}>
            <LoginSVG />
          </figure>
          <div className={styles["option__intro"]}>Have an account?</div>
          <div className={styles["option__title"]}>Log in for more Summarist</div>
          <div className={styles["option__buttons"]}>
            <button 
              className={styles["option__button"]} 
              onClick={() => setShowModal(true)}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>

  )
}

export default LoginToAccount