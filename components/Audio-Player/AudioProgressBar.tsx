"use client"

import inputStyles from "@/styles/progress-bar.module.css"
import { useAudioPlayerContext } from '@/context/AudioPlayerContext'



export const AudioProgressBar = () => {
    const { 
      progressRef, 
      audioRef, 
      timeProgress, 
      setTimeProgress, 
      duration, 
      formatTime, 
    } = useAudioPlayerContext();

    const isMetadataLoading = duration === 0;

    const handleProgressChange = () => {
      if (audioRef.current && progressRef.current) {
        const newTime = Number(progressRef.current.value);
        audioRef.current.currentTime = newTime;
        setTimeProgress(newTime);

        progressRef.current.style.setProperty(
          '--range-progress',
          `${(newTime / duration) * 100}%`
        )
      }
    };

  return (
    <div className={inputStyles["audio__progress--wrapper"]}>
        <div className={inputStyles["audio__time"]}>{formatTime(timeProgress)}</div>
        <input 
          type="range" 
          ref={progressRef} 
          value={timeProgress} 
          max={duration || 0}
          id={inputStyles['track__progress--bar']} 
          onChange={handleProgressChange} 
        />
        <div className={inputStyles["audio__time"]}>
          {isMetadataLoading ? "--:--" : formatTime(duration)}
        </div>
    </div>
  )
}