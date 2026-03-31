

import styles from "@/app/(post-login)/player/[id]/page.module.css"
import { useAudioPlayerContext } from "@/context/AudioPlayerContext"

import { IoMdInformationCircleOutline } from "react-icons/io";




export const TrackDetails = () => {
    const { currentTrack } = useAudioPlayerContext();

    return (
        <>
            <figure className={styles["audio__track--image-mask"]}>
                <figure className={styles["book__image--wrapper"]}>
                    {currentTrack?.image ? (
                        <img 
                            src={currentTrack?.image} 
                            alt={currentTrack?.title} 
                            className={styles['book__image']} /> 
                        ) : (
                            <IoMdInformationCircleOutline 
                                className={styles["audio__track--image-default"]} />)} 
                </figure>
            </figure>
            <div className={styles["audio__track--details-wrapper"]}>
                <div className={styles["audio__track--title"]}>{currentTrack?.title}</div>
                <div className={styles["audio__track--author"]}>{currentTrack?.author}</div>
            </div>
        </>
    )
}