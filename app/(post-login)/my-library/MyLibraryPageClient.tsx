"use client"

import styles from "./page.module.css"
import { Book } from '@/types/book'
import EmblaCarousel from '@/components/Carousel'



interface MyLibraryPageClientProps {
  savedBooks: Book[];
  finishedBooks: Book[];
}

const MyLibraryPageClient = ({ savedBooks, finishedBooks }: MyLibraryPageClientProps) => {
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
              <EmblaCarousel data={savedBooks} />
            </div>

            <h2 className={styles["library__title"]}>
              Finished
            </h2>
            <div className={styles["library__subtitle"]}>
              {finishedBooks?.length} items
            </div>
            <div className={styles["library__books--wrapper"]}>
              <EmblaCarousel data={finishedBooks} />
            </div>
        </div>
    </div>
  )
}

export default MyLibraryPageClient