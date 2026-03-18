'use client'

import styles from "./page.module.css"

import { useEffect, useState } from 'react'
import axios from 'axios'
import BookTags from "@/components/book-page-components/BookTags"
import Skeleton from "@/components/Skeleton"
import { Book } from '@/types/book'
import { useParams } from "next/navigation"
import Login from "@/components/home-components/AuthModal"
import { RootState } from "@/lib/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useAuthModal } from '@/context/AuthModalContext';
import { saveBookToLibrary, removeBookFromLibrary } from "@/services/libraryService"

import { FaRegStar } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { IoMicOutline } from "react-icons/io5";
import { HiOutlineLightBulb } from "react-icons/hi";
import { LuBookText } from "react-icons/lu";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { addBook, removeBook } from "@/lib/redux/librarySlice"

const page = () => {
  const [book, setBook] = useState<Book>();

  const params = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const library = useSelector((state: RootState) => state.library.books);
  const dispatch = useDispatch();
  const isBookSaved = library.some(savedBook => savedBook.id === params.id);
  const {showModal, setShowModal, openModalWithRedirect} = useAuthModal();

  const handleSampleBook = () => {
    openModalWithRedirect(`/player/${params.id}`);
  }

  const handleAddToLibrary = async () => {
    if (!user) {
      setShowModal(true);
      return;
    }
    if (book) {
      try {
        if (isBookSaved) {
          await removeBookFromLibrary(user.uid, book);
          dispatch(removeBook(book.id));
        } else {
          await saveBookToLibrary(user.uid, book);
          dispatch(addBook(book));
        }
      } catch (error) {
        console.error("Library operation failed: ", error)
      }
    }
}

  useEffect(() => {
    const fetchBook = async () => {
      const {data} = await axios.get(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${params.id}`);
      setBook(data || {});
    }
    fetchBook();
  },[params.id]);
  
  return (
    <div className={styles["row"]}>

      <audio src={book?.audioLink}></audio>

      {showModal && <Login />}

      <div className={styles["container"]}>
        <div className={styles["inner__wrapper"]}>
          <div className={styles["inner__book--half"]}>
            <div className={styles["inner__title"]}>
              {book ? book?.title : <Skeleton height="43px" width="70%" /> }
            </div>
            <div className={styles["inner__author"]}>
              {book ? book?.author : <Skeleton height="19px" width="130px"/>}
            </div>
            <div className={styles["inner__subtitle"]}>
              {book ? book?.subTitle : <Skeleton height="22px" width="70%"/>}
            </div>
            <div className={styles["inner__highlights"]}>
              <div className={styles["inner__highlights--wrapper"]}>
                <div className={styles["inner__highlight"]}>
                  {book ? (
                    <>
                      <div className={styles["inner__highlight--icon"]}><FaRegStar /></div>
                      <div className={styles["inner__highlight--text"]}>{book?.averageRating} ({book?.totalRating} Ratings)</div>
                    </>
                  ) : (
                    <Skeleton height="24px" width="130px" />
                  )}
                </div>
                <div className={styles["inner__highlight"]}>
                  {book ? (
                    <>
                      <div className={styles["inner__highlight--icon"]}><FiClock /></div>
                      <div className={styles["inner__highlight--text"]}>99:99</div>
                    </>
                  ) : (
                    <Skeleton height="24px" width="130px" />
                  )}
                </div>
                <div className={styles["inner__highlight"]}>
                  {book ? (
                    <>
                      <div className={styles["inner__highlight--icon"]}><IoMicOutline /></div>
                      <div className={styles["inner__highlight--text"]}>Audio & Text</div>
                    </>
                  ) : (
                    <Skeleton height="24px" width="130px" />
                  )}
                </div>
                <div className={styles["inner__highlight"]}>
                  {book ? (
                    <>
                      <div className={styles["inner__highlight--icon"]}><HiOutlineLightBulb /></div>
                      <div className={styles["inner__highlight--text"]}>{book?.keyIdeas} Key ideas</div>
                    </>
                  ) : (
                    <Skeleton height="24px" width="130px" />
                  )}
                </div>
              </div>
            </div>
            <div className={styles["inner__media--btn-wrapper"]}>
              {book ? (
                <button className={styles["inner__media--btn"]} onClick={handleSampleBook}>
                  <div className={styles["media__btn--icon"]}><LuBookText /></div>
                  <div className={styles["media__btn--text"]}>Read</div>
                </button>

              ) : (
                <Skeleton height="50px" width="150px" />
              )}

              {book ? (
                <button className={styles["inner__media--btn"]} onClick={handleSampleBook}>
                  <div className={styles["media__btn--icon"]}><IoMicOutline /></div>
                  <div className={styles["media__btn--text"]}>Listen</div>
                </button>
              ) : (
                <Skeleton height="50px" width="150px" />
              )}
            </div>

            <div className={styles["inner__bookmark"]} >
              {book ? 
              <>
                <div className={styles["inner__bookmark--icon"]} onClick={handleAddToLibrary} >
                  {isBookSaved ?  <FaBookmark />  : <FaRegBookmark />}
                </div>
                <div className={styles["inner__bookmark--text"]} onClick={handleAddToLibrary}>
                  {isBookSaved ? "Saved to My Library" : "Add Title to My Library"}
                </div>
              </> : (
                <Skeleton height="24px" width="200px" />
              )}

            </div>
            <div className={styles["inner__about--title"]}>What's it about?</div>
            <div className={styles["inner__tags--wrapper"]}>
              {book ? <BookTags tags={book?.tags} /> : <Skeleton height="50px" width="178px" />}
            </div>
            <div className={styles["inner__book--desc"]}>{book ? book?.bookDescription : <Skeleton height="200px" width="100%" />}</div>
            <div className={styles["inner__about-author--title"]}>About the author</div>
            <div className={styles["inner__author--desc"]}>{book ? book?.authorDescription : <Skeleton height="200px" width="100%" />}</div>
          </div>

          <div className={styles["inner__img--half"]}>
            {book ? (
              <figure className={styles["inner__img--wrapper"]}>
                <img src={book?.imageLink} alt="" />
              </figure>
            ) : (
              <Skeleton width="300px" height="300px" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default page