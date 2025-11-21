import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VerticalPlayer } from './components/VerticalPlayer';
import { Sidebar } from './components/Sidebar';
import { UnlockModal } from './components/UnlockModal';
import { MOCK_SERIES } from './constants';
import { Episode, Comment } from './types';

const App: React.FC = () => {
  const [series, setSeries] = useState(MOCK_SERIES);
  const [currentEpisode, setCurrentEpisode] = useState<Episode>(series.episodes[0]);
  const [userCoins, setUserCoins] = useState(150);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [pendingEpisode, setPendingEpisode] = useState<Episode | null>(null);

  // Helper to simulate "watching" an episode
  const handleEpisodeEnd = () => {
    const nextIdx = series.episodes.findIndex(e => e.id === currentEpisode.id) + 1;
    if (nextIdx < series.episodes.length) {
      const nextEp = series.episodes[nextIdx];
      handleEpisodeSelect(nextEp);
    }
  };

  const handleEpisodeSelect = (episode: Episode) => {
    if (episode.isLocked) {
      setPendingEpisode(episode);
      setShowUnlockModal(true);
    } else {
      setCurrentEpisode(episode);
      // Scroll to top on mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUnlock = () => {
    if (pendingEpisode && userCoins >= 50) {
      setUserCoins(prev => prev - 50);
      
      // Unlock locally
      const updatedEpisodes = series.episodes.map(ep => 
        ep.id === pendingEpisode.id ? { ...ep, isLocked: false } : ep
      );
      
      setSeries({ ...series, episodes: updatedEpisodes });
      setCurrentEpisode({ ...pendingEpisode, isLocked: false });
      setShowUnlockModal(false);
      setPendingEpisode(null);
    }
  };

  const handleAddCoins = () => {
    // Simulate purchase
    setUserCoins(prev => prev + 100);
    alert("Simulação: +100 moedas adicionadas!");
  };

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: Date.now(),
      user: 'Você',
      avatar: 'https://picsum.photos/seed/me/50/50',
      text: text,
      likes: 0,
      timestamp: 'Agora'
    };
    setSeries(prev => ({
      ...prev,
      comments: [newComment, ...prev.comments]
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-rose-500/30">
      <Header coins={userCoins} onAddCoins={handleAddCoins} />

      <main className="max-w-[1600px] mx-auto p-0 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-8">
          
          {/* Left: Vertical Player Area */}
          {/* Adjusted constraints to be more "Cinematic" and less "Card-like" */}
          <div className="lg:col-span-7 xl:col-span-8 flex justify-center bg-black md:bg-zinc-900/30 md:rounded-3xl md:p-8 md:border md:border-white/5 relative">
            <div className="w-full md:w-auto md:max-w-[450px] aspect-[9/16] relative shadow-2xl md:rounded-2xl overflow-hidden ring-1 ring-white/5 bg-black">
               <VerticalPlayer 
                 episode={currentEpisode} 
                 onEnded={handleEpisodeEnd}
               />
            </div>
          </div>

          {/* Right: Sidebar (Episodes, Chat, etc) */}
          <div className="lg:col-span-5 xl:col-span-4 p-4 md:p-0">
            <Sidebar 
              series={series}
              currentEpisodeId={currentEpisode.id}
              onEpisodeSelect={handleEpisodeSelect}
              onCommentSubmit={handleAddComment}
            />
          </div>
        </div>
      </main>

      <UnlockModal 
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onUnlock={handleUnlock}
        requiredCoins={50}
        currentCoins={userCoins}
      />
    </div>
  );
};

export default App;