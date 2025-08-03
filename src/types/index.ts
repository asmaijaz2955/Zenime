// src/types/index.ts

export interface FeaturedContentData {
  title: string;
  description: string;
  image: string;
  characters: string[];
}

export interface ContinueWatchingItem {
  id: number;
  title: string;
  image: string;
  progress: number;
}

export interface MediaItem {
  id: number;
  title: string;
  image: string;
  genre?: string;
  rating?: number;
  year?: number;
}

export interface HomeScreenData {
  featured: FeaturedContentData[]; // Changed from single object to array
  continueWatching: ContinueWatchingItem[];
  trending: MediaItem[];
  topSeries: MediaItem[];
  topFilm: MediaItem[];
}

export interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  replace: (screen: string, params?: any) => void;
}