"use client"


import styles from "@/styles/gatekeeper.module.css"
import { useDispatch } from 'react-redux'
import { AppDispatch } from "@/lib/redux/store"
import { useRouter } from 'next/navigation'
import { useAuthModal } from '@/context/AuthModalContext'
import { logoutUser } from '@/services/authService'
import { addToast } from '@/lib/redux/toastSlice'

import CreateAccountSVG from "./CreateAccountSVG"
import { SerializableUser } from "@/types/serializableUser"



interface SignUpAccountProps {
    user: SerializableUser;
}

const SignUpAccount = ({ user }: SignUpAccountProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { openModalWithRedirect } = useAuthModal();

    const handleCreateAccount = async (): Promise<void> => {
        try {
            if (user.uid) {
            await logoutUser();
            }
            openModalWithRedirect('/settings', true);
        } catch (error) {
            console.error('Error upgrading the account:', error);
            dispatch(addToast({ title: "Error", message: "Error upgrading the account.", type: "error" }));
        }
    };

    return (
        <div className={styles["container"]}>
        <div className={styles["row"]}>
            <div className={styles["gatekeeper__headline"]}>
            Great books are waiting on Summarist!
            </div>

            <div className={styles["gatekeeper__options--wrapper"]}>
            <div className={styles["gatekeeper__option"]} onClick={() => handleCreateAccount()} >
            <figure className={styles["option__image--wrapper"]}>
                <CreateAccountSVG />
            </figure>
            <div className={styles["option__intro"]}>Guest users can't go there</div>
            <div className={styles["option__title"]}>Sign up for free today</div>
            <div className={styles["option__buttons"]}>
                <button className={styles["option__button"]}>Sign up</button>
            </div>
            </div>
        </div>
        </div>
        </div>
    )
}

export default SignUpAccount