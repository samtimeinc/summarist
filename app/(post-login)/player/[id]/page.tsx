"use client"

import styles from "./page.module.css"
import "@/app/globals.css"
import { useEffect, useState } from 'react'
import axios from 'axios';
import { Book } from '@/types/book';
import { useParams } from 'next/navigation';
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { selectIsPremiumTier } from "@/lib/redux/subscriptionSlice";
// import { useAuthModal } from "@/context/AuthModalContext";
import { AudioBook, useAudioPlayerContext } from '@/context/AudioPlayerContext';
import { AudioControls } from '@/components/Audio-Player/AudioControls';
import { AudioDetails } from '@/components/Audio-Player/AudioDetails';
import { ProgressBar } from '@/components/Audio-Player/AudioProgressBar';
import Skeleton from '@/components/Skeleton';
import Gatekeeper from "@/components/Gatekeeper";



const page = () => {
  const [book, setBook] = useState<Book>();
  const [isBookPremium, setIsBookPremium] = useState<boolean>(false);

  const params = useParams();
  const { setCurrentTrack } = useAudioPlayerContext();
  // const { openModalWithRedirect } = useAuthModal();
  const isPremiumUser = useSelector(selectIsPremiumTier);
  const isSubscriptionLoading = useSelector((state: RootState) => state.subscription.loading);
  const id = useSelector((state: RootState) => state.auth.user?.uid);
  const isGuest = useSelector((state: RootState) => state.auth.user?.isAnonymous);

  useEffect(() => {
    const fetchBook = async () => {
      if (isSubscriptionLoading) {
        return;
      }

      const { data } = await axios.get(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${params.id}`);
      setIsBookPremium(data?.subscriptionRequired);

      if (data.subscriptionRequired && !isPremiumUser) {
        // openModalWithRedirect(`/player/${params.id}`, true);
        return ;
      }
      const trackData: AudioBook = {
        title: data.title,
        author: data.author,
        src: data.audioLink,
        image: data.imageLink
      }
      setBook(data);
      setCurrentTrack(trackData);
    }

    fetchBook();
    // Cleanup: Wipes the context clean when leaving the route
    return () => {
      setCurrentTrack(null);
    }
  }, [params.id, isPremiumUser, isSubscriptionLoading]);

  if (!book) {
    return (
    <>
      <Gatekeeper isBookPremium={isBookPremium} id={id} isGuest={isGuest}  />
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

        <div className={styles["ebook__summary--title"]}>{ book ? book?.title : <Skeleton height='40px' width='680px' />}</div>
        <div className={styles["ebook__summary--text"]}>
          { book ? (
            book?.summary
          ) : (
            <>
            <Skeleton height='160px' width='752px' marginBottom='32px' />
            <Skeleton height='160px' width='752px' marginBottom='32px' />
            <Skeleton height='160px' width='752px' marginBottom='32px' />
            <Skeleton height='160px' width='752px' marginBottom='32px' />
            <Skeleton height='160px' width='752px' marginBottom='32px' />
            <Skeleton height='160px' width='752px' marginBottom='32px' />
            </>
          )}
        </div>
      </div>

      <div className={styles["audio__player--wrapper"]}>
        <AudioDetails />
        <AudioControls />
        <ProgressBar />
      </div>
    </div>
  )
}

export default page