import { useState, useCallback, useEffect } from 'react';

export function useVideoControls(videoRef: React.RefObject<HTMLVideoElement>) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);

  const video = videoRef.current;

  const play = useCallback(() => {
    video?.play();
    setIsPlaying(true);
  }, [video]);

  const pause = useCallback(() => {
    video?.pause();
    setIsPlaying(false);
  }, [video]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (video) {
      video.currentTime = Math.max(0, Math.min(time, duration));
    }
  }, [video, duration]);

  const setVolume_ = useCallback((vol: number) => {
    const newVolume = Math.max(0, Math.min(1, vol));
    if (video) {
      video.volume = newVolume;
    }
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [video, isMuted]);

  const toggleMute = useCallback(() => {
    if (video) {
      if (isMuted) {
        video.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        video.volume = 0;
        setIsMuted(true);
      }
    }
  }, [video, volume, isMuted]);

  const setPlaybackRate_ = useCallback((rate: number) => {
    if (video) {
      video.playbackRate = rate;
    }
    setPlaybackRate(rate);
  }, [video]);

  const enterFullscreen = useCallback(async (element: HTMLElement) => {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
        setIsFullscreen(true);
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } else if ((document as any).webkitFullscreenElement) {
        await (document as any).webkitExitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  }, []);

  const toggleFullscreen = useCallback(
    (element: HTMLElement) => {
      if (isFullscreen) {
        exitFullscreen();
      } else {
        enterFullscreen(element);
      }
    },
    [isFullscreen, enterFullscreen, exitFullscreen]
  );

  useEffect(() => {
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('progress', handleProgress);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('progress', handleProgress);
    };
  }, [video]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!video) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'KeyK':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'KeyF':
          e.preventDefault();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(video.currentTime - 5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(video.currentTime + 5);
          break;
        case 'KeyJ':
          e.preventDefault();
          seek(video.currentTime - 10);
          break;
        case 'KeyL':
          e.preventDefault();
          seek(video.currentTime + 10);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [video, togglePlayPause, toggleMute, seek]);

  return {
    isPlaying,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    currentTime,
    duration,
    buffered,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolume: setVolume_,
    toggleMute,
    setPlaybackRate: setPlaybackRate_,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
