import { useEffect, useRef } from 'react';
import { VideoProgressData } from '@/lib/types';

export function useVideoProgress(
  videoId: string,
  videoRef: React.RefObject<HTMLVideoElement>,
  onProgressUpdate?: (progress: VideoProgressData) => void
) {
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const saveProgress = (video: HTMLVideoElement) => {
    if (!videoId) return;

    const progress: VideoProgressData = {
      videoId,
      currentTime: video.currentTime,
      duration: video.duration,
      completionRate: video.duration > 0 ? video.currentTime / video.duration : 0,
      lastWatched: new Date().toISOString(),
    };

    localStorage.setItem(`video_progress_${videoId}`, JSON.stringify(progress));
    onProgressUpdate?.(progress);
  };

  const loadProgress = () => {
    const video = videoRef.current;
    if (!video || !videoId) return;

    const saved = localStorage.getItem(`video_progress_${videoId}`);
    if (saved) {
      try {
        const progress: VideoProgressData = JSON.parse(saved);
        if (video.readyState >= 1) {
          video.currentTime = progress.currentTime;
        } else {
          video.addEventListener('loadedmetadata', () => {
            video.currentTime = progress.currentTime;
          }, { once: true });
        }
      } catch (error) {
        console.error('Failed to load video progress:', error);
      }
    }
  };

  useEffect(() => {
    loadProgress();
  }, [videoId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
      }

      progressTimerRef.current = setTimeout(() => {
        saveProgress(video);
      }, 1000);
    };

    const handleEnded = () => {
      saveProgress(video);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
      }
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoId, onProgressUpdate]);

  const getProgress = (video: HTMLVideoElement | null = videoRef.current) => {
    if (!video) return null;

    return {
      currentTime: video.currentTime,
      duration: video.duration,
      percentage: video.duration > 0 ? (video.currentTime / video.duration) * 100 : 0,
    };
  };

  const clearProgress = () => {
    localStorage.removeItem(`video_progress_${videoId}`);
  };

  return {
    getProgress,
    clearProgress,
    saveProgress: () => videoRef.current && saveProgress(videoRef.current),
  };
}
