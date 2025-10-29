import { useRef, useEffect, useCallback } from 'react';

export function useAudio(soundUrl, options = {}) {
  const { volume = 0.5, loop = false, preload = true } = options;
  const audioRef = useRef(null);

  useEffect(() => {
    if (preload && soundUrl) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.volume = volume;
      audioRef.current.loop = loop;

      // Preload
      audioRef.current.load();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundUrl, volume, loop, preload]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.warn('Audio playback failed:', err);
      });
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, pause, stop };
}

// Simple page turn sound generator (for now, we'll use a data URL for a soft swoosh)
export const PAGE_TURN_SOUND = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
