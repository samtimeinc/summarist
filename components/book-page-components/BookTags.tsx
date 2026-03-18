import React from 'react'
import styles from "@/app/(post-login)/book/[id]/page.module.css"

interface BookTagsProp {
    tags: string[] | undefined;
}

const BookTags = ({tags}: BookTagsProp) => {
  return (
    <>
        {tags?.map((tag, index) => (
            <div key={index} className={styles["inner__tag"]}>
                {tag}
            </div>

        ))}
    </>
  )
}

export default BookTags