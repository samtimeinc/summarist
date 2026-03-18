'use client'

import "../globals.css"
import { useState } from "react";
import { useAuthModal } from "@/context/AuthModalContext";
import SideNavBar from '@/components/SideNavBar'
import Search from '@/components/Search'
import Login from "@/components/home-components/AuthModal"

const LayoutContent = ({children}: {children: React.ReactNode}) => {
    const {showModal} = useAuthModal();
    const [showSideBar, setShowSideBar] = useState<boolean>(false);

    const toggleSideBar = () => {
        setShowSideBar(!showSideBar)
    }

    return (
        <div className="wrapper">
            <Search showSideBar={showSideBar} setShowSideBar={setShowSideBar} toggleSideBar={toggleSideBar} />
            <SideNavBar showSideBar={showSideBar} setShowSideBar={setShowSideBar} />
            {showModal && <Login/>}
            {children}
        </div>
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