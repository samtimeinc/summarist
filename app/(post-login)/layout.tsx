'use client'

import "../globals.css"
import { useState } from "react";
import { useAuthModal } from "@/context/AuthModalContext";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import SideNavBar from '@/components/SideNavBar'
import Search from '@/components/Search'
import Login from "@/components/home-components/AuthModal"
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";



const LayoutContent = ({children}: {children: React.ReactNode}) => {
    const [showSideBar, setShowSideBar] = useState<boolean>(false);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState<boolean>(false);

    const width = useWindowWidth();
    const {showModal} = useAuthModal();



    const toggleSideBar = () => {
        if (showSideBar) {
            closeSideBar();
        } else {
            setShowSideBar(true);
            setShowLogoutConfirmation(false);
        }
    }

    const closeSideBar = () => {
        setShowSideBar(false);
        setShowLogoutConfirmation(false);
    }

    return (
        <AudioPlayerProvider>
            <div className="wrapper">
                <Search toggleSideBar={toggleSideBar} />
                <SideNavBar 
                    showSideBar={showSideBar} 
                    showLogoutConfirmation={showLogoutConfirmation} 
                    setShowLogoutConfirmation={setShowLogoutConfirmation} 
                    closeSideBar={closeSideBar}
                />

                {width != null && width <= 768 ? (
                    <div className={
                            `sideBar__overlay 
                            ${!showSideBar ? (
                                'sideBar__overlay--hidden') : ("")}`} 
                        onClick={closeSideBar}></div>
                    ) : ("")
                }

                {showModal && <Login/>}


                {children}

            </div>
        </AudioPlayerProvider>
    )
}

export default function AuthenticatedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <LayoutContent>
            {children}
        </LayoutContent>
    )
}