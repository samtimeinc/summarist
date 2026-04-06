

import { AudioBook } from "@/types/audiobook";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useRef,
  RefObject,
  useCallback,
  useEffect,
} from "react";

interface AudioPlayerContextType {
  currentTrack: AudioBook | null;
  setCurrentTrack: Dispatch<SetStateAction<AudioBook | null>>;
  audioRef: RefObject<HTMLAudioElement>;
  progressRef: RefObject<HTMLInputElement>;
  timeProgress: number;
  setTimeProgress: Dispatch<SetStateAction<number>>;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
  formatTime: (time: number) => string;
//   onLoadedMetaData: React.ReactEventHandler<HTMLAudioElement>;
  onLoadedMetaData: () => void;
  updateProgress: () => void;
  startAnimation: () => void;
  playAnimationRef: React.MutableRefObject<number | null>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined,
);

const formatTime = (time: number | undefined): string => {
  if (typeof time === "number" && !isNaN(time)) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    const formatMinutes = minutes.toString().padStart(2, "0");
    const formatSeconds = seconds.toString().padStart(2, "0");

    return `${formatMinutes}:${formatSeconds}`;
  }
  return "00:00";
};

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioBook | null>(null);
  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const playAnimationRef = useRef<number | null>(null);

  const onLoadedMetaData = () => {
    if (audioRef.current) {
      const seconds = audioRef.current.duration;
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
        "--range-progress",
        `${(currrentTime / duration) * 100}%`,
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

  const contextValue = {
    currentTrack,
    setCurrentTrack,
    timeProgress,
    setTimeProgress,
    duration,
    setDuration,
    audioRef,
    progressRef,
    formatTime,
    onLoadedMetaData,
    updateProgress,
    startAnimation,
    playAnimationRef,
  };

  useEffect(() => {
    if (currentTrack) {
      // 1. Reset numbers to 0 immediately when a new book is selected
      setDuration(0);
      setTimeProgress(0);
  
      // 2. Reset the visual CSS bar (the teal/blue progress)
      if (progressRef.current) {
        progressRef.current.style.setProperty("--range-progress", "0%");
      }
    }

  }, [currentTrack]);

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayerContext must be used within Provider");
  }

  return context;
};
