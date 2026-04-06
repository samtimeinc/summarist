'use client'

import { useState, useEffect } from "react";
import Skeleton from "./Skeleton";

interface BookDurationProp {
  bookId: string;
  audioSrc: string;
  formatTime: (time: number) => string;
}

const durationCache: Record<string, number> = {}

const BookDuration = ({ bookId, audioSrc, formatTime }: BookDurationProp) => {
  const [localDuration, setLocalDuration] = useState<number | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    // Create an "in-memory" audio object
    const audio = new Audio(audioSrc);

    if (durationCache[bookId]) {
      setLocalDuration(durationCache[bookId])
    }

    const handleLoadedMetadata = () => {
      // setLocalDuration(audio.duration);
      const duration = audio.duration;
      durationCache[bookId] = duration;
      setLocalDuration(duration);
    };

    const handleError = () => {
      console.error(`Audio failed to load for book: ${bookId}`);
      setHasError(true);
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);

    // Clean up to prevent memory leaks
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
      audio.removeAttribute("src"); // Forcefully clear the attribute
      audio.load();
    };
  }, [audioSrc, bookId]);

  if (hasError) {
    return <span>N/A</span>;
  }

  if (localDuration === null) {
    return <Skeleton width="40px" height="14px" />; 
  }

  return <span>{formatTime(localDuration)}</span>;
};
export default BookDuration;