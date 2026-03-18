'use client'

import { createContext, useContext, useState } from 'react';

interface AuthModalContextType {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    intendedRoute: string | null;
    openModalWithRedirect: (route: string) => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [showModal, setShowModal] = useState(false);
    const [intendedRoute, setIntendedRoute] = useState<string | null>(null);

    const openModalWithRedirect = (route: string) => {
        setIntendedRoute(route);
        setShowModal(true);
    }
    return (
        <AuthModalContext.Provider value={{ showModal, setShowModal, intendedRoute, openModalWithRedirect }}>
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