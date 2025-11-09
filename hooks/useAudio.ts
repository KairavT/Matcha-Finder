import {
  getIsPlaying,
  pauseBackgroundAudio,
  playBackgroundAudio,
  setBackgroundVolume,
  stopBackgroundAudio,
} from '@/services/audioService';
import { useEffect, useState } from 'react';

export function useAudio() {
  const [isPlaying, setIsPlayingState] = useState(false);

  useEffect(() => {
    // Poll the player state
    const interval = setInterval(() => {
      setIsPlayingState(getIsPlaying());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const play = async () => {
    playBackgroundAudio();
    setIsPlayingState(true);
  };

  const pause = async () => {
    pauseBackgroundAudio();
    setIsPlayingState(false);
  };

  const stop = async () => {
    stopBackgroundAudio();
    setIsPlayingState(false);
  };

  const setVolume = async (volume: number) => {
    setBackgroundVolume(volume);
  };

  return {
    isPlaying,
    play,
    pause,
    stop,
    setVolume,
  };
}
