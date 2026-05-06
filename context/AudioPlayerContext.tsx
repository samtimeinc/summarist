"use client"

import { Book } from "@/types/book";
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
import { saveBookToFinished } from "@/services/libraryService";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";



interface AudioPlayerContextType {
  currentTrack: Book | null;
  setCurrentTrack: Dispatch<SetStateAction<Book | null>>;
  audioRef: RefObject<HTMLAudioElement>;
  progressRef: RefObject<HTMLInputElement>;
  timeProgress: number;
  setTimeProgress: Dispatch<SetStateAction<number>>;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
  formatTime: (time: number) => string;
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
  const [currentTrack, setCurrentTrack] = useState<Book | null>(null);
  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const user = useSelector((state: RootState) => state.auth.user);
  const hasFinishedCurrentBook = useRef(false);
  const lastPercentRef = useRef(0);

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

    if (
      audioRef.current && 
      progressRef.current && 
      duration > 0
    ) {
      const currrentTime = audioRef.current.currentTime;
      setTimeProgress(currrentTime);

      progressRef.current.value = currrentTime.toString();

      const currentPercent = Math.floor((currrentTime / duration) * 100);
      progressRef.current.style.setProperty(
        "--range-progress",
        `${currentPercent}%`,
      );

      if (currentPercent !== lastPercentRef.current) {
        lastPercentRef.current = currentPercent;

        if (
          currentPercent >= 90 && 
          !hasFinishedCurrentBook.current && 
          user?.uid && currentTrack
        ) {
          hasFinishedCurrentBook.current = true;
          saveBookToFinished(user.uid, currentTrack)
          .catch((err) => {
            hasFinishedCurrentBook.current = false;
            console.error("Auto-finish error: ", err);
          });
        }
      }
    }
  }, [duration, user?.uid, currentTrack]);



  const updateProgressRef = useRef(updateProgress);



  useEffect(() => {
    updateProgressRef.current = updateProgress;
  }, [updateProgress])



  const startAnimation = useCallback(() => {
    if (audioRef.current && progressRef.current) {
      const animate = () => {
        updateProgressRef.current();
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, []);



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
      lastPercentRef.current = 0;
      hasFinishedCurrentBook.current = false;
  
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