'use client'
import { useEffect, useState } from 'react'

export function useWindowWidth(): number | null {
    const [windowWidth, setWindowWidth] = useState<number | null>(null);

    useEffect(() => {
        const updateWidth = () => {
            setWindowWidth(window.innerWidth);
        };

        updateWidth();

        window.addEventListener("resize", updateWidth);

        return () => {
            window.removeEventListener("resize", updateWidth)
        };

    },[]);

    return windowWidth;

}