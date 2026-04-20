"use client"

import styles from "./page.module.css"
import { useEffect } from 'react'
import { AudioBook } from "@/types/audiobook";
import { Book } from '@/types/book';
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { selectIsPremiumTier } from "@/lib/redux/subscriptionSlice";
import LoginToAccount from "@/components/GatekeeperLogin";
import { useFontSize } from "@/context/FontSizeContext";
import UpgradePlan from "@/components/GatekeeperUpgradePlan";

import { useAudioPlayerContext } from '@/context/AudioPlayerContext';
import { AudioControls } from '@/components/Audio-Player/AudioControls';
import { AudioDetails } from '@/components/Audio-Player/AudioDetails';
import { AudioProgressBar } from '@/components/Audio-Player/AudioProgressBar';



interface PlayerPageClientProps {
    book: Book;
}



const PlayerPageClient = ({ book }: PlayerPageClientProps) => {

    const { fontSizeState } = useFontSize();
    const { setCurrentTrack } = useAudioPlayerContext();
    const isPremiumUser = useSelector(selectIsPremiumTier);
    const isSubscriptionLoading = useSelector((state: RootState) => state.subscription.loading);
    const isAuthLoading = useSelector((state: RootState) => state.auth.loading);
    const user = useSelector((state: RootState) => state.auth.user);
    const isPremiumContent = book.subscriptionRequired;

    useEffect(() => {
        if (
            isSubscriptionLoading || 
            isAuthLoading || 
            (isPremiumContent && !isPremiumUser) || 
            !user
        ) {
            return;
        }

        const trackData: AudioBook = {
            title: book.title,
            author: book.author,
            src: book.audioLink,
            image: book.imageLink,
        }; 

        setCurrentTrack(trackData);

        // Cleanup: Wipes the context clean when leaving the route
        return () => {
            setCurrentTrack(null);
        }

    }, [book, isSubscriptionLoading, isPremiumUser]);

    if (!user) {
        return (
            <>
                <LoginToAccount />
                <div className="player__shell"></div>
            </>
        )
    }

    if (isPremiumContent && !isPremiumUser) {
        return (
            <>
                <UpgradePlan />
                <div className="player__shell"></div>
            </>
        )
    }

    return (
        <div className={styles["summary"]}>
            
            <div className={styles["ebook__summary"]} style={{}} >

                {book?.subscriptionRequired && <div className={styles["premium__content--wrapper"]}>
                    <div className={styles["premium__content"]}>Premium</div>
                </div>}

                <div className={styles["ebook__summary--title"]}>{book.title}</div>
                <div className={styles["ebook__summary--text"]} style={{fontSize:`${fontSizeState}px`}}>
                    {book.summary}
                </div>
            </div>

            <div className={styles["audio__player--wrapper"]}>
                <AudioDetails />
                <AudioControls />
                <AudioProgressBar />
            </div>
    </div>
    )
}

export default PlayerPageClient