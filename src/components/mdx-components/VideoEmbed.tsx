'use client';

import { VideoPlayer } from '../video/VideoPlayer';
import { useRef } from 'react';

interface VideoEmbedProps {
  src: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  onComplete?: () => void;
}

export function VideoEmbed({
  src,
  title,
  poster,
  autoPlay = false,
  onComplete,
}: VideoEmbedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="my-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="aspect-video bg-black">
        <VideoPlayer
          ref={videoRef}
          src={src}
          poster={poster}
          title={title}
          autoPlay={autoPlay}
          onComplete={onComplete}
          className="w-full h-full"
        />
      </div>
      {title && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {title}
          </p>
        </div>
      )}
    </div>
  );
}
