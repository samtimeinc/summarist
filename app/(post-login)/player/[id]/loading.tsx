import styles from "./page.module.css"
import Skeleton from '@/components/Skeleton';
import { AudioDetailsSkeleton } from "@/components/Audio-Player/AudioDetailsSkeleton";
import { AudioProgressBarSkeleton } from "@/components/Audio-Player/AudioProgressBarSkeleton";
import { AudioControlsSkeleton } from "@/components/Audio-Player/AudioControlsSkeleton";

export default function Loading() {
    return (
        <div className={styles["summary"]}>
            
            <div className={styles["ebook__summary"]} >

                <div className={styles["ebook__summary--title"]}>
                    <Skeleton height="53px" width="70%" />
                </div>
                <div className={styles["ebook__summary--text"]}>
                    <Skeleton width="100%" height="200px" marginBottom="32px" />
                    <Skeleton width="100%" height="200px" marginBottom="32px" />
                    <Skeleton width="100%" height="200px" marginBottom="32px" />
                    <Skeleton width="100%" height="200px" marginBottom="32px" />
                    <Skeleton width="100%" height="200px" marginBottom="32px" />
                    <Skeleton width="100%" height="200px" marginBottom="32px" />
                </div>
            </div>

            <div className={styles["audio__player--wrapper"]}>
                <AudioDetailsSkeleton />
                <AudioControlsSkeleton />
                <AudioProgressBarSkeleton />
            </div>
        </div>
    )
}