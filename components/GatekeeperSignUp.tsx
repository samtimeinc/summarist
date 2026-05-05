"use client"


import styles from "@/styles/gatekeeper.module.css"
import { useAuthModal } from '@/context/AuthModalContext'

import CreateAccountSVG from "./CreateAccountSVG"

const SignUpAccount = () => {
    const { setShowModal } = useAuthModal();

    return (
        <div className={styles["container"]}>
            <div className={styles["row"]}>
                <div className={styles["gatekeeper__headline"]}>
                Great books are waiting on Summarist!
                </div>

                <div className={styles["gatekeeper__options--wrapper"]}>
                    <div className={styles["gatekeeper__option"]} >
                        <figure className={styles["option__image--wrapper"]}>
                            <CreateAccountSVG />
                        </figure>
                        <div className={styles["option__intro"]}>Guest users can't go there</div>
                        <div className={styles["option__title"]}>Register your account</div>
                        <div className={styles["option__buttons"]}>
                            <div className={styles["option__single-button--wrapper"]}>
                                <button 
                                    className={styles["option__button"]}
                                    onClick={() => setShowModal(true)} 
                                >
                                    Sign up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpAccount