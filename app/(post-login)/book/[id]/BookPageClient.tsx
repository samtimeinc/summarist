"use client"

import styles from "./page.module.css"
import { Book } from '@/types/book'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation"
import { useCheckUser } from "@/hooks/useCheckUser"
import { useCheckSubscription } from "@/hooks/useCheckSubscription"
import { saveBookToLibrary, removeBookFromLibrary } from "@/services/libraryService"
import { addBook, removeBook } from "@/lib/redux/librarySlice"
import { addToast } from "@/lib/redux/toastSlice"
import { useAudioPlayerContext } from "@/context/AudioPlayerContext"
import BookDuration from "@/components/BookDuration"
import BookTags from "@/components/book-page-components/BookTags"

import { FiClock } from "react-icons/fi";
import { IoMicOutline } from "react-icons/io5";
import { HiOutlineLightBulb } from "react-icons/hi";
import { LuBookText } from "react-icons/lu";
import { FaRegBookmark, FaBookmark, FaRegStar } from "react-icons/fa";



interface BookPageClientProps {
    book: Book;
}



const BookPageClient = ({ book }: BookPageClientProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const library = useSelector((state: RootState) => state.library.books);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const { checkUserLogIn } = useCheckUser();
    const { checkSubscription } = useCheckSubscription();
    const { formatTime } = useAudioPlayerContext();

    const isBookSaved = library.some(savedBook => savedBook.id === book.id);

    const handleSampleBook = () => {
        const intendedRoute = `/player/${book.id}`;
        const isSubRequired = book.subscriptionRequired;
        
        if (!checkUserLogIn(intendedRoute, isSubRequired)) {
            return;
        }

        if (!checkSubscription(isSubRequired)) {
            return;
        }

        router.push(intendedRoute);
    }

    const handleAddToLibrary = async () => {
        // if no user is logged in, immediately exit code block an present user with the Login
        if (!checkUserLogIn()) {
            return;
        }

        if (book && user) {
        // Store original state if needed
        const wasBookSaved = isBookSaved;
        try {
            if (wasBookSaved) { 
                // book is already in user's library
                dispatch(removeBook(book.id));
                await removeBookFromLibrary(user.uid, book);
                dispatch(
                    addToast(
                        { 
                            title: "Book removed from library", 
                            message: `Removed ${book.title}`, 
                            type: "info"
                        }
                    )
                );
            } else { 
                // book is not currently in user's library
                dispatch(addBook(book));
                await saveBookToLibrary(user.uid, book);
                dispatch(
                    addToast(
                        { 
                            title: "Book added to library", 
                            message: `Added ${book.title}`, 
                            type: "success"
                        }
                    )
                );
            }
        } catch (error) {
            console.error(
                "Library operation failed, changes will be rolled back: ", error);
            if (wasBookSaved) {
                dispatch(addBook(book));
            } else {
                dispatch(removeBook(book.id));
            }
            dispatch(
                addToast(
                    {
                        title: "Error updating library", 
                        message: "Please try again.", 
                        type: "error"
                    }
                )
            );
        }}
    }

    return (
        <div className={styles["row"]}>
            <div className={styles["container"]}>

                {book.subscriptionRequired && 
                    <div className={styles["premium__content--wrapper"]}>
                        <div className={styles["premium__content"]}>
                            Premium
                        </div>
                    </div>
                }

                <div className={styles["inner__wrapper"]}>
                    <div className={styles["inner__book--half"]}>
                        <div className={styles["inner__title"]}>
                            {book.title}
                        </div>
                        <div className={styles["inner__author"]}>
                            {book.author}
                        </div>
                        <div className={styles["inner__subtitle"]}>
                            {book.subTitle}
                        </div>
                        <div className={styles["inner__highlights"]}>
                            <div className={styles["inner__highlights--wrapper"]}>
                                <div className={styles["inner__highlight"]}>
                                    <div className={styles["inner__highlight--icon"]}>
                                        <FaRegStar />
                                    </div>
                                    <div className={styles["inner__highlight--text"]}>
                                        {book.averageRating} <span> </span>
                                        ({book.totalRating} Ratings)
                                    </div>
                                </div>
                                <div className={styles["inner__highlight"]}>
                                    <div className={styles["inner__highlight--icon"]}><FiClock /></div>
                                    <div className={styles["inner__highlight--text"]}>
                                        <BookDuration 
                                        bookId={book.id}
                                        audioSrc={book.audioLink} 
                                        formatTime={formatTime} 
                                        />
                                    </div>
                                </div>
                                <div className={styles["inner__highlight"]}>
                                    <div className={styles["inner__highlight--icon"]}><IoMicOutline /></div>
                                    <div className={styles["inner__highlight--text"]}>Audio & Text</div>
                                </div>
                                <div className={styles["inner__highlight"]}>
                                    <div className={styles["inner__highlight--icon"]}><HiOutlineLightBulb /></div>
                                    <div className={styles["inner__highlight--text"]}>
                                        {book.keyIdeas} Key ideas
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles["inner__media--btn-wrapper"]}>
                            <button 
                                className={styles["inner__media--btn"]} 
                                onClick={handleSampleBook}
                            >
                                <div className={styles["media__btn--icon"]}><LuBookText /></div>
                                <div className={styles["media__btn--text"]}>Read</div>
                            </button>

                            <button 
                                className={styles["inner__media--btn"]} 
                                onClick={handleSampleBook}
                            >
                                <div className={styles["media__btn--icon"]}><IoMicOutline /></div>
                                <div className={styles["media__btn--text"]}>Listen</div>
                            </button>
                        </div>

                        <div 
                            className={styles["inner__bookmark"]} 
                            onClick={handleAddToLibrary} 
                        >
                            <div className={styles["inner__bookmark--icon"]} >
                                {isBookSaved ?  <FaBookmark />  : <FaRegBookmark />}
                            </div>
                            <div className={styles["inner__bookmark--text"]} >
                                {isBookSaved ? "Saved to My Library" : "Add Title to My Library"}
                            </div>
                        </div>
                        <div className={styles["inner__about--title"]}>What's it about?</div>
                        <div className={styles["inner__tags--wrapper"]}>
                            <BookTags tags={book.tags} />
                        </div>
                        <div className={styles["inner__book--desc"]}>
                            {book.bookDescription}
                        </div>
                        <div className={styles["inner__about-author--title"]}>About the author</div>
                        <div className={styles["inner__author--desc"]}>
                            {book.authorDescription}
                        </div>
                    </div>

                    <div className={styles["inner__img--half"]}>
                        <figure className={styles["inner__img--wrapper"]}>
                            <img 
                                src={book.imageLink} 
                                alt={book.title} 
                            />
                        </figure>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default BookPageClient;