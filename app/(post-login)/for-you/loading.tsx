import styles from "./page.module.css";
import Skeleton from "@/components/Skeleton";
import CarouselSkeleton from "@/components/CarouselSkeleton";

export default function Loading() {
  return (
    <div className={styles["row"]}>
    <div className={styles["container"]}>
      <div className={styles['forYou__wrapper']}>
        
        <Skeleton height="27px" width="250px" marginBottom="16px" />

        <div className={styles["selected__book"]}>
            <div className={styles["selected__book--subtitle"]}>
                <Skeleton height="70px" width="100%" />
            </div>

            <div className={styles["selected__divider"]}></div>

            <div className={styles['selected__book--content']}>
                <div>
                    <figure className={styles['selected__book--img-wrapper']}>
                        <Skeleton width="100%" height="100%" />
                    </figure>
                </div>

                <div className={styles['selected__book--info']}>
                    <div>
                        <div className={styles['selected__book--title']}>
                            <Skeleton width="194px" height="20px" />
                        </div>
                    </div>
                    <div className={styles["selected__book--author"]}>
                        <Skeleton width="90px" height="20px" />
                    </div>
                    <div className={styles["selected__play"]}>
                        <div>
                            <div className={styles['selected__play--icon']} >
                                <Skeleton width="100%" height="100%" />
                            </div>
                        </div>
                        <div className={styles["selected__play--text"]}>
                            <Skeleton width="94px" height="17px" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Skeleton height="27px" width="250px" marginBottom="16px" />

        <div className={styles["forYou-subtitle"]}>
            <Skeleton height="20px" width="230px" />
        </div>
        <div className={styles["recommended__books"]}>
            <CarouselSkeleton marginBottom="76px" />
        </div>

        <Skeleton height="27px" width="200px" />

        <div className={styles["forYou-subtitle"]}>
            <Skeleton height="20px" width="180px" />
        </div>
        <div className={styles["suggested__books"]}>
              <CarouselSkeleton />
        </div>
      </div>
    </div>
  </div>
  );
}