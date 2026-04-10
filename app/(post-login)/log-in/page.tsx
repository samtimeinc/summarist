"use client"

import styles from "./page.module.css"
import { useAuthModal } from "@/context/AuthModalContext"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LoadingAnimation from "@/components/LoadingAnimation"

import LoginSVG from '@/components/LoginSVG'

const LoginPage = () => {
    const { setShowModal } = useAuthModal();
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();
    const isAuthLoading = useSelector((state: RootState) => state.auth.loading);

    useEffect(() => {
        if (!user && !isAuthLoading) {
            setShowModal(true);
        }
        if (user) {
            router.replace('/for-you');
        }
    }, [user, router, isAuthLoading, setShowModal])

    if (isAuthLoading) {
        return (
            <div className={styles["login__loading-animation"]}>
                <LoadingAnimation 
                    message="One moment..." 
                    fontSize={64} 
                    color="#2bd97c" 
                />
            </div>
        )
    }
    
    if (user) {
        return null;
    }

  return (
    <div className={styles["container"]}>
        <div className={styles["row"]}>
            <div className={styles["login__content"]}>
                <figure className={styles["login__image--wrapper"]}>
                    <LoginSVG />
                </figure>

                <div className={styles["login__title"]}>
                    Log in to enjoy more Summarist
                </div>

                <button 
                    className={styles["login__btn"]} 
                    onClick={() => setShowModal(true)}
                >
                    Log in
                </button>

                <div className={styles["login__create--link"]} onClick={() => setShowModal(true)}>
                    or Sign up
                </div>

            </div>
        </div>
    </div>
  )
}

export default LoginPage