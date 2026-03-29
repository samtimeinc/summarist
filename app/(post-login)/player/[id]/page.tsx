"use client"

import React, { useEffect, useState } from 'react'
import styles from "./page.module.css"
import { Book } from '@/types/book';
import axios from 'axios';
import { useParams } from 'next/navigation';

import TenSecondFForwardIcon from '@/components/TenSecondFForwardIcon';
import TenSecondRewindIcon from '@/components/TenSecondRewindIcon';
import { FaPlay, FaPause } from "react-icons/fa";



const page = () => {
  const [book, setBook] = useState<Book>();
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const params = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      const { data } = await axios.get(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${params.id}`);
      setBook(data);
    }
    fetchBook();
  }, [params.id])


  return (
    <div className={styles["summary"]}>
      <div className={styles["ebook__summary"]} style={{}} >

        {book?.subscriptionRequired && <div className={styles["premium__content--wrapper"]}>
          <div className={styles["premium__content"]}>Premium</div>
        </div>}

        <div className={styles["ebook__summary--title"]}>{book?.title}</div>
        <div className={styles["ebook__summary--text"]}>{book?.summary}</div>
      </div>

      <div className={styles["audio__player--wrapper"]}>
        <audio src={book?.audioLink}></audio>

        <div className={styles["audio__track--wrapper"]}>
          <figure className={styles["audio__track--image-mask"]}>
            <figure className={styles["book__image--wrapper"]}>
              <img src={book?.imageLink} alt="" className={styles['book__image']} />
            </figure>
          </figure>
          <div className={styles["audio__track--details-wrapper"]}>
            <div className={styles["audio__track--title"]}>{book?.title}</div>
            <div className={styles["audio__track--author"]}>{book?.author}</div>
          </div>
        </div>
        <div className={styles["audio__controls--wrapper"]}>
          <div className={styles["audio__controls"]}>
            <button className={styles["audio__controls--btn"]}>
              <TenSecondRewindIcon />
            </button>
            <button className={`${styles["audio__controls--btn"]} ${styles["audio__controls--btn-play"]}`}>
              {isAudioPlaying ? <FaPlay className={styles["audio__controls--play-icon"]} /> : <FaPause  />}
            </button>
            <button className={styles["audio__controls--btn"]}>
              <TenSecondFForwardIcon />
            </button>
          </div>
        </div>
        <div className={styles["audio__progress--wrapper"]}>
          <div className={styles["audio__time"]}>00:00</div>
          <input type="range" name="" id="progress-bar" value="" className={styles["audio__progress--bar"]} />
          <div className={styles["audio__time"]}>--:-- : 99:99</div>
        </div>
      </div>
    </div>
  )
}

export default page