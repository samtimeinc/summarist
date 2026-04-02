

import styles from "@/app/(post-login)/player/[id]/page.module.css"
import { useAudioPlayerContext } from "@/context/AudioPlayerContext"
import Skeleton from "../Skeleton";

import { IoMdInformationCircleOutline } from "react-icons/io";




export const AudioDetails = () => {
    const { currentTrack } = useAudioPlayerContext();

    return (
        <div className={styles["audio__track--wrapper"]}>
            <figure className={styles["audio__track--image-mask"]}>
                {currentTrack ? (
                    <figure className={styles["book__image--wrapper"]}>
                        {currentTrack?.image ? (
                            <img 
                                src={currentTrack?.image} 
                                alt={currentTrack?.title} 
                                className={styles['book__image']} /> 
                        ) : (
                            <IoMdInformationCircleOutline 
                                className={styles["audio__track--image-default"]} />
                        )} 
                    </figure>
                ) : (
                    <Skeleton width="48px" height="52px" />
                )}
            </figure>
            <div className={styles["audio__track--details-wrapper"]}>
                <div className={styles["audio__track--title"]}>
                    {currentTrack ? currentTrack?.title : <Skeleton height="18px" width="200px" />}
                </div>
                <div className={styles["audio__track--author"]}>
                    {currentTrack ? currentTrack?.author : <Skeleton height="17px" width="80px" />}
                </div>
            </div>
        </div>
    )
}