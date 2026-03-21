'use client'

import styles from "../../app/page.module.css"

import React, { useEffect, useState } from 'react'
import { loginWithGoogle, 
    loginWithEmail, 
    loginAsGuest, 
    passwordReset, 
    registerWithEmail, 
    throwError } from '@/services/authService';
import LoadingAnimation from '../LoadingAnimation';
import Skeleton from '../Skeleton';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/context/AuthModalContext';

import { FaUser } from "react-icons/fa";
import { IoClose } from 'react-icons/io5';

type AuthMode = "login" | "reset" | "create";
type LoadingMode = "noLoad" | "guest" | "google" | "email" | "pwReset" | "newAccount";

const Login = () => {
    const [authMode, setAuthMode] = useState<AuthMode>("login");
    const [loadingMode, setLoadingMode] = useState<LoadingMode>("noLoad");
    const [toggleDisabled, setToggleDisabled] = useState<boolean>(false);
    const [loginEmail, setLoginEmail] = useState<string>("");
    const [loginPassword, setLoginPassword] = useState<string>("");
    const [pwResetEmail, setPwResetEmail] = useState<string>("");
    const [createEmail, setCreateEmail] = useState<string>("");
    const [createPassword, setCreatePassword] = useState<string>("");

    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();
    const tier = useSelector((state: RootState) => state.subscription.tier);
    const {setShowModal, intendedRoute, subscriptionRequired} = useAuthModal();

    


    /* Show/Hide Modal */
    const handleOverlayClick = () => {
        setAuthMode("login")
        setShowModal(false);
    }
    const handlePopupClick = (event: React. MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    }



    /* Auth Service Handlers */
    const handleGuestLogin = async () => {
        setLoadingMode("guest");
        setToggleDisabled(true);
        try {
            await loginAsGuest();
        } catch (error) {
            setLoadingMode("noLoad");
            setToggleDisabled(false);
            const message = throwError(error);
            alert(`Login as guest failed. Please try again.\n\n${message}`);
        }
    }

    const handleGoogleLogin = async () => {
        setLoadingMode("google");
        setToggleDisabled(true);
        try {
            await loginWithGoogle();
        } catch (error) {
            setLoadingMode("noLoad");
            setToggleDisabled(false);
            const message = throwError(error);
            alert(`There was an issue logging in with Google. Please try again.\n\n${message}`);
        }
    }

    const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setLoadingMode("email");
        setToggleDisabled(true);
        try {
            await loginWithEmail(loginEmail, loginPassword);
        } catch (error) {
            setLoadingMode("noLoad");
            setToggleDisabled(false);
            const message = throwError(error);
            alert(`Please check your email and/or password and try again.\n\n${message}`);
        }
    }

    const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await passwordReset(pwResetEmail);
            setLoadingMode("pwReset");
        } catch (error) {
            setLoadingMode("noLoad");
            const message = throwError(error);
            alert(`Reset password failed. Please try again.\n\n${message}`);
        }
    }

    const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoadingMode("newAccount");
        setToggleDisabled(true);
        try {
            await registerWithEmail(createEmail, createPassword);
        } catch (error) {
            setLoadingMode("noLoad");
            setToggleDisabled(false);
            const message = throwError(error);
            alert(`Failed to create an account. Please try again.\n\n${message}`);
        }
    }




    /* Modal Views */
    const renderLoginView = () => {
        return (
            <>
                <div className={styles["modal__content"]}>

                    <div className={styles["modal__title"]}>
                        Log in to Summarist
                    </div>

                    <button 
                    type='button' 
                    disabled={toggleDisabled} 
                    onClick={handleGuestLogin}
                    className={`
                        ${styles["btn"]} 
                        ${styles["btn__guest--login"]} 
                        ${loadingMode !== "noLoad" ? `${styles["loading"]}` : ""}`} >

                        <figure className={styles["icon__guest"]}>
                            <FaUser color='#fff' size={24} />
                        </figure>
                        <div>
                            {loadingMode === "guest" ? (
                                <LoadingAnimation message='Please wait' fontSize={20} color='#fff'/>
                                ) : ("Log in as guest")}
                        </div>
                    </button>

                    <div className={styles["modal__divider"]}>
                        <span className={styles["modal__divider--text"]}>or</span>
                    </div>

                    <button 
                    type='button' 
                    disabled={toggleDisabled} 
                    onClick={handleGoogleLogin}
                    className={`
                        ${styles["btn"]} 
                        ${styles["btn__google--login"]} 
                        ${loadingMode !== "noLoad" ? `${styles["loading"]}` : ""}`} >

                        <figure className={styles["icon__google--wrapper"]}>
                            <img src="/google.png"></img>
                        </figure>
                        <div>
                            {loadingMode === "google" ? (
                                <LoadingAnimation message='Please wait' fontSize={20} color='#fff' />
                                ) : ("Log in with Google")}
                        </div>
                    </button>

                    <div className={styles["modal__divider"]}>
                        <span className={styles["modal__divider--text"]}>or</span>
                    </div>

                    <form 
                    onSubmit={handleEmailLogin} 
                    className={styles["modal__form"]} >

                        <input 
                        type='email' 
                        disabled={toggleDisabled}
                        value={loginEmail} 
                        onChange={(event) => setLoginEmail(event.target.value)}
                        id='login__email' 
                        placeholder='Email Address' />

                        <input 
                        type='password' 
                        disabled={toggleDisabled}
                        value={loginPassword} 
                        onChange={(event) => setLoginPassword(event.target.value)}
                        id='login__password' 
                        placeholder='Password' />

                        <button 
                        type='submit' 
                        disabled={toggleDisabled} 
                        className={styles["btn"]} >
                            {loadingMode === "email" ? (
                                <LoadingAnimation message='Please wait' fontSize={20} color='#032b41' />
                            ) : ("Login")}
                        </button>
                    </form>
                </div>

                {toggleDisabled ? (
                    <div className={styles["modal__block"]} />
                ) : (
                    <div 
                    className={styles["modal__forgotPassword"]} 
                    onClick={() => setAuthMode("reset")} >
                        Forgot your password?
                    </div>
                )}

                <div className={styles["modal__footer"]} >
                    {toggleDisabled ? (
                            <Skeleton height="40px" width="398px" borderRadius="0px 0px 8px 8px" message='Logging in' />
                        ) : (
                        <button 
                        disabled={toggleDisabled}
                        className={styles["btn__modal--switch"]} 
                        onClick={() => setAuthMode("create")} >
                            Don't have an account?
                        </button>
                    )}
                </div>
            </>
        )
    }

    const renderPwResetView = () => {
        return (
            <>
                <div className={styles["modal__content"]} >

                    <div className={styles["modal__title"]} >
                        Reset your password
                    </div>

                    {loadingMode === "pwReset" ? (
                        <div style={{height:"96px"}}>
                            A reset link has been sent to<br />{pwResetEmail}

                            <button type='button' 
                            className={`${styles["btn"]} ${styles["btn-showModal-false"]}`} 
                            onClick={() => setShowModal(false)} >
                                OK
                            </button>
                        </div>
                    ) : (
                        <form 
                        onSubmit={handlePasswordReset}
                        className={styles["modal__form"]} >

                            <input 
                            type='email' 
                            value={pwResetEmail} 
                            onChange={(event) => setPwResetEmail(event.target.value)}
                            id='passwordReset__email' 
                            placeholder='Email address' />

                            <button 
                            type='submit' 
                            disabled={toggleDisabled} 
                            className={styles["btn"]} >
                                Reset password
                            </button>
                        </form>
                    )} 
                </div>

                <button 
                onClick={() => setAuthMode("login")}
                className={styles["btn__modal--switch"]} >
                    Have an account? Go to login 
                </button>
            </>
        )
    }

    const renderCreateView = () => {
        return (
            <>
                <div className={styles["modal__content"]} >

                    <div className={styles["modal__title"]} >
                        Create an account
                    </div>

                    <button 
                    type='button' 
                    disabled={toggleDisabled} 
                    onClick={handleGoogleLogin}
                    className={`${styles["btn"]} ${styles["btn__google--login"]}`} >
                        <figure className={styles["icon__google--wrapper"]} >
                            <img src="google.png" />
                        </figure>
                        <div>
                            {loadingMode === "google" ? (
                                <LoadingAnimation message='Please wait' fontSize={20} color='#fff' />
                                ) : ("Sign up with Google")}
                        </div>
                    </button>

                    <div className={styles["modal__divider"]} >
                        <span className={styles["modal__divider--text"]}>or</span>
                    </div>

                    <form 
                    onSubmit={handleCreateAccount}
                    className={styles["modal__form"]} >

                        <input 
                        type='email' 
                        disabled={toggleDisabled} 
                        value={createEmail} 
                        onChange={(event) => setCreateEmail(event.target.value)}
                        id='createAccount__email' 
                        placeholder='Email address' />

                        <input 
                        type='password' 
                        disabled={toggleDisabled} 
                        value={createPassword} 
                        onChange={(event) => setCreatePassword(event.target.value)} 
                        id='createAccount__password' 
                        placeholder='Password' />

                        <button 
                        type='submit' 
                        disabled={toggleDisabled} 
                        className={styles["btn"]} >
                            {loadingMode === "newAccount" ? (
                                <LoadingAnimation message='Please wait' fontSize={20} color='#032b41' />
                            ) : (
                                "Create account"
                            )}
                        </button>
                    </form>
                </div>

                <div className={styles["modal__footer"]} >
                    {toggleDisabled ? (
                            <Skeleton height="40px" width="398px" borderRadius="0px 0px 8px 8px" />
                        ) : (
                        <button 
                        disabled={toggleDisabled}
                        className={styles["btn__modal--switch"]} 
                        onClick={() => setAuthMode("login")} >
                            Have an account? Go to login
                        </button>
                    )}
                </div>
            </>
        )
    }
    

    useEffect(() => {
        if (user) {
            setShowModal(false);
            if (intendedRoute) {
                if (subscriptionRequired && tier !== "premium") {
                    router.push("/choose-plan")
                } else {
                    router.push(intendedRoute);
                }
            }
        }
    }, [user]);

  return (
    <div 
    onClick={handleOverlayClick}
    className={styles["modal__wrapper"]} >
        
        <div 
        onClick={handlePopupClick} 
        className={`${styles["modal__modal"]} `} >

            {authMode === "login" && renderLoginView()}
            {authMode === "reset" && renderPwResetView()}
            {authMode === "create" && renderCreateView()}
            
            <div className={styles["modal__hideModal"]} 
            onClick={() => {
                    setShowModal(false);
                    setAuthMode("login");
                }} >
                <IoClose />
            </div>
        </div>
    </div>
  )
}

export default Login