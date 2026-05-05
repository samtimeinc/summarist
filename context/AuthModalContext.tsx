'use client'

import { createContext, useContext, useState } from 'react';



interface AuthModalContextType {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    intendedRoute: string | null;
    subscriptionRequired: boolean;
    openModalWithRedirect: (route: string, subscriptionRequired?: boolean) => void;
    authMode: AuthMode;
    setAuthMode: React.Dispatch<React.SetStateAction<AuthMode>>;
    resetRedirect: () => void;
}

export type AuthMode = "login" | "reset" | "create";

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [showModal, setShowModal] = useState(false);
    const [intendedRoute, setIntendedRoute] = useState<string | null>(null);
    const [subscriptionRequired, setSubscriptionRequired] = useState<boolean>(false);
    const [authMode, setAuthMode] = useState<AuthMode>("login");

    const openModalWithRedirect = (route: string, requireSub: boolean = false) => {
        setIntendedRoute(route);
        setSubscriptionRequired(requireSub);
        setAuthMode("login");
        setShowModal(true);
    }

    // Initialize resetRedirect
    const resetRedirect = () => {
        setIntendedRoute(null);
        setSubscriptionRequired(false);
    }

    return (
        <AuthModalContext.Provider value={{ 
            showModal, 
            setShowModal, 
            intendedRoute, 
            subscriptionRequired, 
            openModalWithRedirect, 
            authMode,
            setAuthMode, 
            resetRedirect,
        }}>
            {children}
        </AuthModalContext.Provider>
    );
};

export const useAuthModal = () => {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error('useAuthModal must be used within AuthModalProvider');
    } 
    return context;
};