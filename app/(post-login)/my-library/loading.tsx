
import styles from './page.module.css'
import Skeleton from '@/components/Skeleton'
import CarouselSkeleton from '@/components/CarouselSkeleton'

export default function Loading() {
    return (
        <div className={styles["row"]}>
            <div className={styles["container"]}>
                <h2 className={styles["library__title"]}>
                    <Skeleton width="150px" height="29px" />
                </h2>
                <div className={styles["library__subtitle"]}>
                    <Skeleton width='100px' height='22px' />
                </div>
                <div className={styles["library__books--wrapper"]}>
                <CarouselSkeleton />
                </div>

                <h2 className={styles["library__title"]}>
                    <Skeleton width="150px" height="29px" />
                </h2>
                <div className={styles["library__subtitle"]}>
                    <Skeleton width='100px' height='22px' />
                </div>
                <div className={styles["library__books--wrapper"]}>
                <CarouselSkeleton />
                </div>
            </div>
        </div>
    )
}