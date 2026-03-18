import React from "react";
import styles from "../../app/page.module.css"
import { BsStarFill } from 'react-icons/bs';

interface ReviewProp {
    name: string;
    rating: number;
    startParagraph: string;
    boldParagraph: string;
    endParagraph: string;
}

const Review = ({ name, rating, startParagraph, boldParagraph, endParagraph}: ReviewProp) => {
    function displayRating(): React.ReactNode[] {
        return new Array(rating).fill(0).map((_, index) => (
            <React.Fragment key={index} >
                <BsStarFill />
            </React.Fragment>
        ))
    }

  return (
    <div className={styles["review"]}>
        <div className={styles["review__header"]}>
            <div className={styles["review__name"]}>
                {name}
            </div>
            <div className={styles["review__stars"]}>
                {displayRating()}
            </div>
        </div>
        <div className={styles["review__body"]}>
            {startParagraph}
            <span className={styles["bold"]} >{boldParagraph}</span>
            {endParagraph}
        </div>
    </div>
  )
}

export default Review