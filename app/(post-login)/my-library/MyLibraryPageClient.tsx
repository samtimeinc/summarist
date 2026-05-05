"use client"

import styles from "./page.module.css";
import { Book } from '@/types/book';
import EmblaCarousel from '@/components/Carousel';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";



interface MyLibraryPageClientProps {
  savedBooks: Book[];
  finishedBooks: Book[];
}

const MyLibraryPageClient = ({ savedBooks: initialSaved, finishedBooks: initialFinsihed }: MyLibraryPageClientProps) => {
  const router = useRouter();
  const reduxSaved = useSelector((state:RootState) => state.library.savedBooks);
  const reduxFinished = useSelector((state: RootState) => state.library.finishedBooks);

  const savedBooks = reduxSaved.length > 0 ? reduxSaved : initialSaved;
  const finishedBooks = reduxFinished.length >0 ? reduxFinished : initialFinsihed;

  const handleExploreBooks = () => {
    router.push("/for-you");
  }

  return (
    <div className={styles["row"]}>
        <div className={styles["container"]}>
            <h2 className={styles["library__title"]}>
              Saved Books
            </h2>
            <div className={styles["library__subtitle"]}>
              {savedBooks.length} Items
            </div>
            <div className={styles["library__books--wrapper"]}>
              {
                savedBooks.length < 1 ? 
                  <div className={styles["library__button--wrapper"]}>
                      <button 
                        className={styles["library__button--more-books"]}
                        onClick={() => handleExploreBooks()}
                      >
                      Explore books
                    </button>
                  </div> : 
                  <EmblaCarousel data={savedBooks} />
              }
            </div>

            <h2 className={styles["library__title"]}>
              Finished
            </h2>
            <div className={styles["library__subtitle"]}>
              {finishedBooks?.length} items
            </div>
            <div className={styles["library__books--wrapper"]}>
              {(
                savedBooks.length > 0 && 
                finishedBooks.length < 1
              ) ? 
                <div className={styles["library__button--wrapper"]}>
                    <button 
                      className={styles["library__button--more-books"]}
                      onClick={() => handleExploreBooks()}
                    >
                    Explore books
                  </button>
                </div> : 
                <EmblaCarousel data={finishedBooks} />
              }
            </div>
        </div>
    </div>
  )
}

export default MyLibraryPageClient