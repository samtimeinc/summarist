

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useRef, RefObject } from "react";



export interface AudioBook {
    title: string;
    author: string;
    src: string;
    image: string;
}

interface AudioPlayerContextType {
    currentTrack: AudioBook | null;
    setCurrentTrack: Dispatch<SetStateAction<AudioBook | null>>;
    audioRef: RefObject<HTMLAudioElement>;
    progressRef: RefObject<HTMLInputElement>;
    timeProgress: number;
    setTimeProgress: Dispatch<SetStateAction<number>>; 
    duration: number; 
    setDuration: Dispatch<SetStateAction<number>>; 
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [currentTrack, setCurrentTrack] = useState<AudioBook | null>(null);
    const [timeProgress, setTimeProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLInputElement>(null);
    const contextValue = {
        currentTrack,
        setCurrentTrack,
        timeProgress, 
        setTimeProgress, 
        duration, 
        setDuration, 
        audioRef, 
        progressRef, 
    };

    return (
        <AudioPlayerContext.Provider value={contextValue} >
            {children}
        </AudioPlayerContext.Provider>
    )
}



export const useAudioPlayerContext = (): AudioPlayerContextType => {
    const context = useContext(AudioPlayerContext);
    if (context === undefined) {
        throw new Error(
            "useAudioPlayerContext must be used within an AudioPlayerProvider"
        )
    }

    return context;
}