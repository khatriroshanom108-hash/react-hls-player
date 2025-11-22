export interface CourseMetadata {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail?: string;
}

export interface LessonMetadata {
  id: string;
  title: string;
  description?: string;
  chapter: number;
  lesson: number;
  duration?: string;
  tags?: string[];
  prerequisites?: string[];
  videoUrl?: string;
  thumbnail?: string;
}

export interface MDXFrontmatter {
  title: string;
  description?: string;
  author?: string;
  date?: string;
  chapter: number;
  lesson: number;
  duration?: string;
  tags?: string[];
  prerequisites?: string[];
  videoUrl?: string;
  thumbnail?: string;
}

export interface TOCItem {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  children?: TOCItem[];
}

export interface VideoProgressData {
  videoId: string;
  currentTime: number;
  duration: number;
  completionRate: number;
  lastWatched: string;
  qualitySwitches?: number;
}

export interface QualityLevel {
  id: number;
  name: string;
  bitrate: number;
  resolution: string;
}

export interface VideoMetrics {
  bandwidth: number;
  currentQuality: number;
  bufferingEvents: number;
  averageBitrate: number;
}
