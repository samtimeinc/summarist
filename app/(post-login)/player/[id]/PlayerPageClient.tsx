"use client"

import styles from "./page.module.css"
import { useEffect } from 'react'
import { AudioBook } from "@/types/audiobook";
import { Book } from '@/types/book';
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { selectIsPremiumTier } from "@/lib/redux/subscriptionSlice";
import Gatekeeper from "@/components/Gatekeeper";
import { useFontSize } from "@/context/FontSizeContext";

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
    const id = useSelector((state: RootState) => state.auth.user?.uid);
    const user = useSelector((state: RootState) => state.auth.user);
    const isGuest = useSelector((state: RootState) => state.auth.user?.isAnonymous);
    const userMustUpgradePlan = book.subscriptionRequired && !isPremiumUser;

    useEffect(() => {
        if (isSubscriptionLoading || 
            userMustUpgradePlan || 
            isGuest || 
            !user) {
            return;
        }

        const trackData: AudioBook = {
            title: book.title,
            author: book.author,
            src: book.audioLink,
            image: book.imageLink,
        } 
        setCurrentTrack(trackData);

        // Cleanup: Wipes the context clean when leaving the route
        return () => {
            setCurrentTrack(null);
        }

    }, [book, isSubscriptionLoading, isPremiumUser]);

    // Gatekeeper displays if user is not logged in, is guest, or does not have premium subscription
    if (userMustUpgradePlan || isGuest || !user) {
        return (
            <>
                <Gatekeeper 
                    id={id} 
                    isGuest={isGuest} 
                    isSubscriptionLoading={isSubscriptionLoading} 
                    isAuthLoading={isAuthLoading} 
                />
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