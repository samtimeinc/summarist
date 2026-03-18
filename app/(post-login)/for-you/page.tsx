'use client'

import styles from "./page.module.css"

import { useEffect, useState } from 'react'
import {Book} from "@/types/book"
import axios from 'axios';
import Link from 'next/link';
import Carousel from '@/components/Carousel';
import Skeleton from '@/components/Skeleton';
import CarouselSkeleton from '@/components/CarouselSkeleton';

import { FaCirclePlay } from "react-icons/fa6";

export default function page() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);

  useEffect(() => {
    
    const promises = [
      axios.get<Book[]>(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"),
      axios.get<Book[]>(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"),
      axios.get<Book[]>(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"),
    ]
        
    const fetchBooks = async () => {
      const [selBook, recBooks, suggBooks] = await Promise.all(promises)
      setSelectedBook(selBook.data[0]);
      setRecommendedBooks(recBooks.data);
      setSuggestedBooks(suggBooks.data);
    }
    fetchBooks();
  },[]);

  return (
    <div className={styles["row"]}>
      <div className={styles["container"]}>
        <div className={styles['forYou__wrapper']}>
          
          <h2>Selected just for you</h2>
          {selectedBook ? (
            <div className={styles["selected__book"]}>
              <audio src={selectedBook.audioLink} />
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
                  <div className={styles["audio__controls"]}>
                    <Link href={`/book/${selectedBook.id}`} >
                      <FaCirclePlay className={styles['audio__controls--icon']} />
                    </Link>
                      <div className={styles["audio__controls--text"]}>99 mins 99 secs</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Skeleton height='200px' width='70%' borderRadius='4px' marginBottom="32px" />
          )}

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
