'use client'

import styles from "../../app/page.module.css";

import React, { 
    useEffect, 
    useState, 
    useCallback, 
} from 'react';
import { auth } from "@/lib/firebase/firebase";
import { EmailAuthProvider, linkWithCredential, } from "firebase/auth";
import { 
    loginWithGoogle, 
    loginWithEmail, 
    loginAsGuest, 
    passwordReset, 
    registerWithEmail, 
    getErrorMessage, 
} from '@/services/authService';
import LoadingAnimation from '../LoadingAnimation';
import Skeleton from '../Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/context/AuthModalContext';
import { addToast } from "@/lib/redux/toastSlice";
import { AuthMode } from "@/context/AuthModalContext";


import { FaUser } from "react-icons/fa";
import { IoClose } from 'react-icons/io5';

// export type AuthMode = "login" | "reset" | "create";
type LoadingMode = "noLoad" | "guest" | "google" | "email" | "pwReset" | "newAccount";

const Login = () => {
    // const [authMode, setAuthMode] = useState<AuthMode>("login");
    const [loadingMode, setLoadingMode] = useState<LoadingMode>("noLoad");
    const [toggleDisabled, setToggleDisabled] = useState<boolean>(false);

    const [loginEmail, setLoginEmail] = useState<string>("");
    const [loginPassword, setLoginPassword] = useState<string>("");
    const [pwResetEmail, setPwResetEmail] = useState<string>("");
    const [createEmail, setCreateEmail] = useState<string>("");
    const [createPassword, setCreatePassword] = useState<string>("");

    const user = useSelector((state: RootState) => state.auth.user);
    const tier = useSelector((state: RootState) => state.subscription.tier);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { 
        setShowModal, 
        intendedRoute, 
        subscriptionRequired, 
        authMode,
        setAuthMode,
        resetRedirect,
    } = useAuthModal();



    // Crentralized Error Handler for Toasts
    const handleAuthError = useCallback((error: any) => {
        let message = "An unexpected error occurred.";
        const errorCode = error?.code;

        switch (errorCode) {
            case 'auth/invalid-email':
                message = "That email address is invalid.";
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                message = "Invalid login credentials.";
                break;
            case 'auth/weak-password':
                message = "Password is too short. Please use at least 6 characters.";
                break;
            case 'auth/email-already-in-use':
                message = "This email is already associated with an account.";
                break;
            default:
                message = error?.message || "Authentication failed.";
        }

        dispatch(addToast({
            title: "Authentication Error",
            message,
            type: "error",
        }));
    }, [dispatch]);



    // Handle anonymous-to-permanent account
    useEffect(() => {
        if (user?.isAnonymous) {
            setAuthMode("create");
        }
    }, [user?.isAnonymous]);



    // Redirect Logic
    useEffect(() => {
        if (user && !user?.isAnonymous && intendedRoute) {
            setShowModal(false);
            if (subscriptionRequired && tier === "basic") {
                router.push("/settings");
            } else {
                router.push(intendedRoute);
            }

            resetRedirect();
        }
    }, [
        user, 
        intendedRoute, 
        subscriptionRequired, 
        tier, 
        router, 
        setShowModal,
        resetRedirect,
    ]);

    

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
            handleAuthError(error);
        } finally {
            setShowModal(false);
            setLoadingMode("noLoad");
            setToggleDisabled(false);
        }
    }

    const handleGoogleLogin = async () => {
        setLoadingMode("google");
        setToggleDisabled(true);
        try {
            await loginWithGoogle();
        } catch (error) {
            handleAuthError(error);
        } finally {
            setShowModal(false);
            setLoadingMode("noLoad");
            setToggleDisabled(false);
        }
    }

    const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setLoadingMode("email");
        setToggleDisabled(true);
        try {
            await loginWithEmail(loginEmail, loginPassword);
        } catch (error) {
            handleAuthError(error);
        } finally {
            setShowModal(false);
            setLoadingMode("noLoad");
            setToggleDisabled(false);
        }
    }

    const handleCreateOrLinkAccount = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoadingMode("newAccount");
        setToggleDisabled(true);

        try {
            if (user?.isAnonymous) {
                const credential = EmailAuthProvider.credential(createEmail, createPassword);
                await linkWithCredential(auth.currentUser!, credential)
                dispatch(addToast({
                    title: "Welcome!",
                    message: "Account linked.",
                    type: "success",
                }));
            } else {
                await registerWithEmail(createEmail, createPassword);
                dispatch(addToast({
                    title: "Welcome!",
                    message: "Account created.",
                    type: "success",
                }));
            };
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoadingMode("noLoad");
            setToggleDisabled(false);
        }
    } 

    const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await passwordReset(pwResetEmail);
            setLoadingMode("pwReset");
            dispatch(addToast({
                title: "Success",
                message: "Reset link sent to your email.",
                type: "success",
            }))
        } catch (error) {
            setLoadingMode("noLoad");
            console.error("Password reset error: ", error)
            const message = getErrorMessage(error) || "Could not send reset link.";
            dispatch(addToast({ title: "Error", message, type: "error"}));
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
                        disabled={toggleDisabled || !!user} 
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
                        disabled={toggleDisabled || !!user} 
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
                        className={styles["modal__form"]} 
                    >
                        <input 
                            type='email' 
                            disabled={toggleDisabled || !!user}
                            value={loginEmail} 
                            onChange={(event) => setLoginEmail(event.target.value)}
                            id='login__email' 
                            placeholder='Email Address' 
                        />

                        <input 
                            type='password' 
                            disabled={toggleDisabled || !!user}
                            value={loginPassword} 
                            onChange={(event) => setLoginPassword(event.target.value)}
                            id='login__password' 
                            placeholder='Password' 
                        />

                        <button 
                            type='submit' 
                            disabled={toggleDisabled || !!user} 
                            className={styles["btn"]} >
                                {
                                    loadingMode === "email" ? 
                                    (
                                        <LoadingAnimation 
                                            message='Please wait' 
                                            fontSize={20} color='#032b41' 
                                        />
                                    ) : ("Login")
                                }
                        </button>
                    </form>
                </div>

                {toggleDisabled ? (
                    <div className={styles["modal__block"]} />
                ) : (
                    <div 
                        className={styles["modal__forgotPassword"]} 
                        onClick={() => setAuthMode("reset")} 
                    >
                        Forgot your password?
                    </div>
                )}

                <div className={styles["modal__footer"]} >
                    {
                        toggleDisabled ? 
                            (
                                <Skeleton height="40px" width="398px" borderRadius="0px 0px 8px 8px" message='Logging in' />
                            ) : (
                                <button 
                                    disabled={toggleDisabled}
                                    className={styles["btn__modal--switch"]} 
                                    onClick={() => setAuthMode("create")} 
                                >
                                    Sign up for a new account
                                </button>
                            )
                    }
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

                    {
                        loadingMode === "pwReset" ? (
                            <div style={{height:"96px"}}>
                                A reset link has been sent to<br />{pwResetEmail}

                                <button 
                                    type='button' 
                                    className={`${styles["btn"]} ${styles["btn-showModal-false"]}`} 
                                    onClick={() => setShowModal(false)} 
                                >
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
                                        placeholder='Email address' 
                                    />

                                    <button 
                                        type='submit' 
                                        disabled={toggleDisabled} 
                                        className={styles["btn"]} 
                                    >
                                        Reset password
                                    </button>
                            </form>
                    )
                    } 
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
                        {user?.isAnonymous ? "Register this account" : "Create an account"}
                    </div>

                    {user?.isAnonymous ? "" : 
                        <>
                            <button 
                                type='button' 
                                disabled={toggleDisabled} 
                                onClick={handleGoogleLogin}
                                className={`${styles["btn"]} ${styles["btn__google--login"]}`} 
                            >
                                    <figure className={styles["icon__google--wrapper"]} >
                                        <img src="google.png" />
                                    </figure>
                                    <div>
                                        {
                                            loadingMode === "google" ? 
                                            (
                                                <LoadingAnimation 
                                                    message='Please wait' 
                                                    fontSize={20} color='#fff' 
                                                />
                                            ) : ("Sign up with Google")}
                                    </div>
                            </button>

                            <div className={styles["modal__divider"]} >
                                <span className={styles["modal__divider--text"]}>or</span>
                            </div>
                        </>
                    }

                    <form 
                        onSubmit={handleCreateOrLinkAccount}
                        className={styles["modal__form"]} >

                            <input 
                                type='email' 
                                disabled={toggleDisabled} 
                                value={createEmail} 
                                onChange={(event) => setCreateEmail(event.target.value)}
                                id='createAccount__email' 
                                placeholder='Email address' 
                            />

                            <input 
                                type='password' 
                                disabled={toggleDisabled} 
                                value={createPassword} 
                                onChange={(event) => setCreatePassword(event.target.value)} 
                                id='createAccount__password' 
                                placeholder='Password' 
                            />

                            <button 
                                type='submit' 
                                disabled={toggleDisabled} 
                                className={styles["btn"]} 
                            >
                                {
                                    loadingMode === "newAccount" ? 
                                        (
                                            <LoadingAnimation 
                                                message='Please wait' 
                                                fontSize={20} color='#032b41' 
                                            />
                                        ) : (
                                            user?.isAnonymous ? "Sign up" : "Create account"
                                        )
                                }
                            </button>
                    </form>
                </div>

                <div className={styles["modal__footer"]} >
                    {
                        user?.isAnonymous ? "" : 
                            (
                                toggleDisabled ? 
                                    (
                                        <Skeleton height="40px" width="398px" borderRadius="0px 0px 8px 8px" />
                                    ) : (
                                        <button 
                                            disabled={toggleDisabled}
                                            className={styles["btn__modal--switch"]} 
                                            onClick={() => setAuthMode("login")} 
                                        >
                                            Have an account? Go to login
                                        </button>
                                    )
                            )
                    }
                </div>
            </>
        )
    }

  return (
    <div 
        onClick={handleOverlayClick}
        className={styles["modal__wrapper"]} 
    >
           
        <div 
            onClick={handlePopupClick} 
            className={`${styles["modal__modal"]} `} 
        >

            {authMode === "login" && renderLoginView()}
            {authMode === "reset" && renderPwResetView()}
            {authMode === "create" && renderCreateView()}
            
            <div 
                className={styles["modal__hideModal"]} 
                onClick={() => {
                        setShowModal(false);
                        setAuthMode("login");
                        
                    }
                } 
            >
                <IoClose />
            </div>
        </div>
    </div>
  )
}

export default Login