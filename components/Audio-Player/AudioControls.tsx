"use client"

import styles from "@/app/(post-login)/player/[id]/page.module.css"
import { useEffect, useState } from "react";
import { useAudioPlayerContext } from "@/context/AudioPlayerContext";

import TenSecondRewindIcon from "../TenSecondRewindIcon";
import TenSecondFForwardIcon from "../TenSecondFForwardIcon";
import { FaPause, FaPlay } from "react-icons/fa";



export const AudioControls = () => {
    const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

    const { 
        currentTrack, 
        audioRef, 
        onLoadedMetaData, 
        updateProgress, 
        startAnimation, 
        playAnimationRef 
    } = useAudioPlayerContext();

    const skipBackward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime -= 10;
            updateProgress();
        }   
    };

    const skipForward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime += 10;
            updateProgress();
        }
    };

    useEffect(() => {
        if (isAudioPlaying) {
            audioRef.current?.play();
            startAnimation();
        } else {
            audioRef.current?.pause();
            if (playAnimationRef.current !== null) {
                cancelAnimationFrame(playAnimationRef.current);
                playAnimationRef.current = null;
            }
            updateProgress();
        }
        return () => {
            if (playAnimationRef.current !== null) {
                cancelAnimationFrame(playAnimationRef.current);
            }
        };        
    }, [isAudioPlaying, startAnimation, updateProgress, audioRef]);

    return (
        <div className={styles["audio__controls--wrapper"]}>
            <audio src={currentTrack?.src} ref={audioRef} onLoadedMetadata={onLoadedMetaData} />
          
            <div className={styles["audio__controls"]}>
                <button className={styles["audio__controls--btn"]} onClick={skipBackward} >
                    <TenSecondRewindIcon />
                </button>
                <button 
                    className={`
                        ${styles["audio__controls--btn"]} 
                        ${styles["audio__controls--btn-play"]}`} 
                        onClick={() => setIsAudioPlaying((prev) => !prev)} >

                    {isAudioPlaying ? 
                        <FaPause /> : 
                        <FaPlay className={styles["audio__controls--play-icon"]} /> }
                </button>
                <button className={styles["audio__controls--btn"]} onClick={skipForward} >
                    <TenSecondFForwardIcon />
                </button>
            </div>
      </div>
    )
}