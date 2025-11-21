export interface Episode {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
  isLocked: boolean;
  views: string;
  duration: string;
}

export interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  timestamp: string;
}

export interface SeriesData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  cast: string[];
  totalEpisodes: number;
  rating: number;
  episodes: Episode[];
  comments: Comment[];
}

export enum Tab {
  EPISODES = 'episodes',
  DETAILS = 'details',
  COMMENTS = 'comments',
  AI_CHAT = 'ai_chat'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}