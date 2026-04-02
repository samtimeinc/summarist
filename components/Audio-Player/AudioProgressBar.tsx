

import inputStyles from "@/styles/progress-bar.module.css"
import { useAudioPlayerContext } from '@/context/AudioPlayerContext'

export const ProgressBar = () => {
    const { progressRef, audioRef, timeProgress, setTimeProgress, duration } = useAudioPlayerContext();
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

    const formatTime = (time: number | undefined): string => {
      if (typeof time === "number" && !isNaN(time)) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        const formatMinutes = minutes.toString().padStart(2, "0");
        const formatSeconds = seconds.toString().padStart(2, "0");

        return `${formatMinutes}:${formatSeconds}`
      }
      return "--:--"
    };

  return (
    <div className={inputStyles["audio__progress--wrapper"]}>
        <div className={inputStyles["audio__time"]}>{formatTime(timeProgress)}</div>
        <input 
          type="range" 
          ref={progressRef} 
          defaultValue="0" 
          max={duration || 0}
          id={inputStyles['track__progress--bar']} 
          onChange={handleProgressChange}/>
        <div className={inputStyles["audio__time"]}>{formatTime(duration)}</div>
    </div>
  )
}