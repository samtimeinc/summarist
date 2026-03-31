"use client"

import styles from "@/app/(post-login)/player/[id]/page.module.css"
import { useCallback, useEffect, useRef, useState } from "react";
import { useAudioPlayerContext } from "@/context/AudioPlayerContext";

import TenSecondRewindIcon from "./TenSecondRewindIcon";
import TenSecondFForwardIcon from "./TenSecondFForwardIcon";
import { FaPause, FaPlay } from "react-icons/fa";



export const AudioControls = () => {
    const [isAudioPlaying, setIsAudioPlaying] = useState<Boolean>(false);

    const { currentTrack, audioRef, duration, setDuration, setTimeProgress, progressRef } = useAudioPlayerContext();
    const playAnimationRef = useRef<number | null>(null);

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

    const onLoadedMetaData = () => {
        const seconds = audioRef.current?.duration;
        if (seconds !== undefined) {
            setDuration(seconds);
            if (progressRef.current) {
                progressRef.current.max = seconds.toString();
            }
        }
    };

    const updateProgress = useCallback(() => {
        if (audioRef.current && progressRef.current && duration) {
            const currrentTime = audioRef.current.currentTime;
            setTimeProgress(currrentTime);
            progressRef.current.value = currrentTime.toString();
            progressRef.current.style.setProperty(
                '--range-progress',
                `${(currrentTime / duration) * 100}%`
            );
        }
    }, [duration, setTimeProgress, audioRef, progressRef]);

    const startAnimation = useCallback(() => {
        if (audioRef.current && progressRef.current && duration) {
            const animate = () => {
                updateProgress();
                playAnimationRef.current = requestAnimationFrame(animate);
            };
            playAnimationRef.current = requestAnimationFrame(animate);
        }
    }, [updateProgress, duration, audioRef, progressRef]);

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
    }, [isAudioPlaying, startAnimation, updateProgress, audioRef])

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