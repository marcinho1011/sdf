import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, Share2, MoreVertical, ChevronLeft, MessageCircle } from 'lucide-react';
import { Episode } from '../types';

interface VerticalPlayerProps {
  episode: Episode;
  onEnded: () => void;
}

export const VerticalPlayer: React.FC<VerticalPlayerProps> = ({ episode, onEnded }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    // Reset state when episode changes
    setIsPlaying(true);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
         // Autoplay policy might block
         setIsPlaying(false);
      });
    }
  }, [episode]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    videoRef.current.currentTime = percentage * videoRef.current.duration;
  };

  return (
    <div 
      className="relative w-full h-full bg-black overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={() => setShowControls(prev => !prev)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={episode.videoUrl}
        className="w-full h-full object-cover"
        loop={false}
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
      />

      {/* Top Vignette */}
      <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Bottom Vignette */}
      <div className={`absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`} />

      {/* Top Controls */}
      <div className={`absolute top-4 left-4 right-4 flex justify-between items-center z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Center Play Button (only when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-20 h-20 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center ring-1 ring-white/20 animate-pulse">
            <Play className="w-10 h-10 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Right Side Actions */}
      <div 
        className="absolute right-4 bottom-28 flex flex-col gap-6 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="flex flex-col items-center gap-1 group/btn"
        >
          <div className={`p-3 rounded-full backdrop-blur-xl transition-all ${isLiked ? 'bg-rose-600 text-white' : 'bg-black/40 text-white group-hover/btn:bg-black/60'}`}>
            <Heart className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow-lg">12.5k</span>
        </button>

        <button className="flex flex-col items-center gap-1 group/btn">
          <div className="p-3 rounded-full bg-black/40 backdrop-blur-xl text-white group-hover/btn:bg-black/60 transition-all">
            <MessageCircle className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow-lg">402</span>
        </button>

        <button className="flex flex-col items-center gap-1 group/btn">
          <div className="p-3 rounded-full bg-black/40 backdrop-blur-xl text-white group-hover/btn:bg-black/60 transition-all">
            <Share2 className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow-lg">Share</span>
        </button>
      </div>

      {/* Bottom Info & Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-5 z-20 transition-all duration-300 ${showControls ? 'translate-y-0' : 'translate-y-2 opacity-80'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 pr-16">
          <h3 className="text-xl font-bold text-white drop-shadow-md mb-1">{episode.title}</h3>
          <p className="text-sm text-zinc-300 drop-shadow-md line-clamp-2 font-medium">
            A verdade finalmente é revelada neste episódio emocionante...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-2">
          <button onClick={togglePlay} className="text-white hover:text-rose-500 transition-colors">
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          </button>
          <div 
            className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer group/progress relative"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-rose-600 rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-400">{episode.duration}</span>
        </div>
      </div>
    </div>
  );
};