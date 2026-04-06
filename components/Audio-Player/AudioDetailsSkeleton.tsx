

import styles from "@/app/(post-login)/player/[id]/page.module.css"
import Skeleton from "../Skeleton";




export const AudioDetailsSkeleton = () => {

    return (
        <div className={styles["audio__track--wrapper"]}>
            <figure className={styles["audio__track--image-mask"]}>
                <figure className={styles["book__image--wrapper"]}>
                    <Skeleton width="48px" height="52px" />
                </figure>
            </figure>

            <div className={styles["audio__track--details-wrapper"]}>
                <div className={styles["audio__track--title"]}>
                    <Skeleton height="18px" width="200px" />
                </div>
                
                <div className={styles["audio__track--author"]}>
                    <Skeleton height="17px" width="80px" />
                </div>
            </div>
        </div>
    )
}