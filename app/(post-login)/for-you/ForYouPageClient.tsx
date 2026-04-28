"use client"

import styles from "./page.module.css"
import { useEffect } from "react";
import { useAudioPlayerContext } from "@/context/AudioPlayerContext";
import { Book } from "@/types/book";
import BookDuration from "@/components/BookDuration";
import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { addToast } from "@/lib/redux/toastSlice";
import Carousel from '@/components/Carousel';
import CarouselSkeleton from '@/components/CarouselSkeleton';

import { FaCirclePlay } from "react-icons/fa6";



interface ForYouPageClientProps {
    selectedBook: Book;
    recommendedBooks: Book[];
    suggestedBooks: Book[];
}

const ForYouPageClient = ({
    selectedBook, 
    recommendedBooks,
    suggestedBooks
}: ForYouPageClientProps ) => {
    const { formatTime } = useAudioPlayerContext();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const dispatch = useDispatch<AppDispatch>();

    
    
    useEffect(() => {
      if (sessionId) {
        dispatch(addToast({
          title: "Success!", 
          message: "You have access to all premium content", 
          type: "success",
        }));
      }
    }, [sessionId, dispatch]);


    
    return (
      <div className={styles["row"]}>
        <div className={styles["container"]}>
          <div className={styles['forYou__wrapper']}>
            
            <h2>Selected just for you</h2>

              <div className={styles["selected__book"]}>
                <div className={styles["selected__book--subtitle"]}>
                  {selectedBook?.subTitle}
                </div>

                <div className={styles["selected__divider"]}></div>

                <div className={styles['selected__book--content']}>
                  <Link href={`/book/${selectedBook.id}`}>
                    <figure className={styles['selected__book--img-wrapper']}>
                      <img src={selectedBook?.imageLink} alt={selectedBook?.title}/>
                    </figure>
                  </Link>

                  <div className={styles['selected__book--info']}>
                    <Link href={`/book/${selectedBook.id}`} >
                      <div className={styles['selected__book--title']}>{selectedBook?.title}</div>
                    </Link>
                    <div className={styles["selected__book--author"]}>{selectedBook?.author}</div>
                    <div className={styles["selected__play"]}>
                      <Link href={`/book/${selectedBook.id}`} >
                        <FaCirclePlay className={styles['selected__play--icon']} />
                      </Link>
                        <div className={styles["selected__play--text"]}>
                          <BookDuration 
                            bookId={selectedBook.id}
                            audioSrc={selectedBook.audioLink} 
                            formatTime={formatTime} 
                          />
                        </div>
                    </div>
                  </div>
                </div>
              </div>

            <h2>Recommended for you</h2>
            <div className={styles["forYou-subtitle"]}>We think you'll like these</div>
            <div className={styles["recommended__books"]}>
                {recommendedBooks.length > 0 ? (
                  <Carousel data={recommendedBooks} />
                ) : (
                  <CarouselSkeleton marginBottom="76px" />
                )}
            </div>

            <h2>Suggested books</h2>
            <div className={styles["forYou-subtitle"]}>Browse these books</div>
            <div className={styles["suggested__books"]}>
                {suggestedBooks.length > 0 ? (
                  <Carousel data={suggestedBooks} />
                ) : (
                  <CarouselSkeleton />
                )}
            </div>

          </div>
        </div>
      </div>
    )
}
export default ForYouPageClient