'use client';

import { useRef, useEffect, useState, forwardRef } from 'react';
import HlsJs from 'hls.js';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  onProgress?: (time: number) => void;
  onComplete?: () => void;
  initialTime?: number;
  className?: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (
    {
      src,
      poster,
      title,
      autoPlay = false,
      onProgress,
      onComplete,
      initialTime = 0,
      className = '',
    },
    videoRef
  ) => {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hlsRef = useRef<HlsJs | null>(null);
    const internalRef = useRef<HTMLVideoElement>(null);
    const ref = videoRef || internalRef;

    useEffect(() => {
      let video: HTMLVideoElement | null = null;

      if (ref && 'current' in ref) {
        video = ref.current;
      }

      if (!video) return;
      if (!src) return;

      const setupHLS = () => {
        if (HlsJs.isSupported()) {
          const hls = new HlsJs({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            maxBufferLength: 30,
            maxMaxBufferLength: 600,
            abrEwmaDefaultEstimate: 500000,
          });

          hls.loadSource(src);
          hls.attachMedia(video);

          hls.on(HlsJs.Events.MANIFEST_PARSED, () => {
            if (autoPlay) {
              video.play().catch(() => {
                console.log('Autoplay prevented by browser');
              });
            }
            setIsReady(true);
            setError(null);
          });

          hls.on(HlsJs.Events.ERROR, (event: any, data: any) => {
            if (data.fatal) {
              switch (data.type) {
                case HlsJs.ErrorTypes.NETWORK_ERROR:
                  setError('Network error occurred');
                  break;
                case HlsJs.ErrorTypes.MEDIA_ERROR:
                  setError('Media error occurred');
                  break;
                default:
                  setError('An error occurred');
              }
            }
          });

          hlsRef.current = hls;

          return () => {
            hls.destroy();
          };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          setIsReady(true);
          setError(null);
        }
      };

      const cleanup = setupHLS();

      const handleTimeUpdate = () => {
        onProgress?.(video.currentTime);
      };

      const handleEnded = () => {
        onComplete?.();
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);

      if (initialTime > 0 && video.readyState >= 1) {
        video.currentTime = initialTime;
      }

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
        cleanup?.();
      };
    }, [src, autoPlay, onProgress, onComplete, initialTime, ref]);

    return (
      <div className={`relative w-full bg-black ${className}`}>
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        <video
          ref={ref}
          poster={poster}
          className="w-full h-full"
          controls
          crossOrigin="anonymous"
        />
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
