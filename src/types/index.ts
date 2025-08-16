// src/types/index.ts

export interface FeaturedContentData {
  id?: string;
  title: string;
  description: string;
  image?: string;
  characters?: string[];
  subtitle?: string;
  streamData?: {
    url: string;
    type: string;
    subtitles: any[];
    intro?: { start: number; end: number };
    outro?: { start: number; end: number };
    servers: any[];
    currentServer: string;
  };
}

export interface ContinueWatchingItem {
  id: number;
  title: string;
  image: string;
  progress: number;
  lastWatched?: string;
  currentEpisode?: number;
  totalEpisodes?: number;
  description?: string;
  genre?: string[];
  year?: string;
  rating?: string;
}

export interface MediaItem {
  id: number;
  title: string;
  image: string;
  genre?: string | string[];
  rating?: number;
  year?: number;
  description?: string;
  type?: 'movie' | 'series' | 'anime';
  duration?: string;
}

export interface HomeScreenData {
  featured: FeaturedContentData; // Single object, not array
  continueWatching: ContinueWatchingItem[];
  trending: MediaItem[];
  topSeries: MediaItem[];
  topFilm: MediaItem[];
}

// Stream data interfaces for API response
export interface StreamApiResponse {
  success: boolean;
  results: {
    streamingLink: {
      id: string;
      type: 'sub' | 'dub';
      link: {
        file: string;
        type: string;
      };
      tracks: Array<{
        file: string;
        label: string;
        kind: string;
        default?: boolean;
      }>;
      intro: {
        start: number;
        end: number;
      };
      outro: {
        start: number;
        end: number;
      };
      server: string;
    };
    servers: Array<{
      type: 'sub' | 'dub';
      data_id: string;
      server_id: string;
      serverName: string;
    }>;
  };
}

export interface ApiError {
  error: string;
}

// Navigation types
export interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  replace: (screen: string, params?: any) => void;
  openDrawer?: () => void;
}