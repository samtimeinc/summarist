"use client"

import { createContext, useContext, useEffect, useState } from "react"

type FontSizeContextType = {
    fontSizeState: number;
    setFontSize: (size: number) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider = ({
    children
}: {
    children: React.ReactNode 
}) => {
    const [fontSizeState, setFontSizeState] = useState<number>(16);

    useEffect(() => {
        const savedSize = localStorage.getItem('summarist-font-size');
        if (savedSize) {
            setFontSize(parseInt(savedSize));
        }
    },[]);

    const setFontSize = (size: number) => {
        setFontSizeState(size);
        localStorage.setItem('summarist-font-size', size.toString());
    }

    return (
        <FontSizeContext.Provider value={{ fontSizeState, setFontSize }}>
            {children}
        </FontSizeContext.Provider>
    );
};

export const useFontSize = () => {
    const context = useContext(FontSizeContext);
    if (!context) {
        throw new Error("useFontSize must be used within a FontSizeProvider");
    }
    return context;
}