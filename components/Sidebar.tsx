import React, { useState } from 'react';
import { Tab, SeriesData, Episode, Comment } from '../types';
import { Lock, PlayCircle, Sparkles, MessageCircle, Info } from 'lucide-react';
import { chatWithCharacter } from '../services/gemini';

interface SidebarProps {
  series: SeriesData;
  currentEpisodeId: number;
  onEpisodeSelect: (episode: Episode) => void;
  onCommentSubmit: (text: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ series, currentEpisodeId, onEpisodeSelect, onCommentSubmit }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.EPISODES);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Olá! Eu sou a Sofia. Você não acredita no que acabei de descobrir sobre meu pai...' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await chatWithCharacter('Sofia', chatHistory, userMsg);
    
    setIsTyping(false);
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newComment.trim()) return;
    onCommentSubmit(newComment);
    setNewComment('');
  };

  return (
    <div className="flex flex-col h-[600px] md:h-[calc(100vh-120px)] bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-black/20">
        {[
          { id: Tab.EPISODES, icon: PlayCircle, label: 'Episódios' },
          { id: Tab.DETAILS, icon: Info, label: 'Detalhes' },
          { id: Tab.COMMENTS, icon: MessageCircle, label: 'Comentários' },
          { id: Tab.AI_CHAT, icon: Sparkles, label: 'Chat IA', highlight: true },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-all relative
              ${activeTab === tab.id ? 'text-white bg-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}
            `}
          >
            <tab.icon className={`w-5 h-5 ${tab.highlight && activeTab !== tab.id ? 'text-rose-500' : ''} ${activeTab === tab.id ? 'text-rose-500' : ''}`} />
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative bg-zinc-900">
        
        {/* EPISODES TAB */}
        {activeTab === Tab.EPISODES && (
          <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-3">
            {series.episodes.map((ep) => {
              const isCurrent = ep.id === currentEpisodeId;
              const isLocked = ep.isLocked;
              
              return (
                <button
                  key={ep.id}
                  onClick={() => onEpisodeSelect(ep)}
                  className={`
                    relative aspect-[3/4] rounded-lg overflow-hidden border transition-all group
                    ${isCurrent ? 'border-rose-500 ring-1 ring-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.15)]' : 'border-transparent hover:border-zinc-700'}
                  `}
                >
                  <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity bg-zinc-800" />
                  
                  {/* Overlay content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-2 flex flex-col justify-end">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold ${isCurrent ? 'text-rose-500' : 'text-white'}`}>
                        Ep {ep.id}
                      </span>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                        <PlayCircle className="w-3 h-3" /> {ep.views}
                      </span>
                    </div>
                    
                    {isLocked && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 p-2.5 rounded-full backdrop-blur-sm border border-white/10">
                        <Lock className="w-4 h-4 text-yellow-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Playing Indicator */}
                  {isCurrent && (
                     <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e] animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* DETAILS TAB */}
        {activeTab === Tab.DETAILS && (
          <div className="p-6 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-3 leading-tight">{series.title}</h2>
              <div className="flex flex-wrap gap-2 mb-5">
                {series.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-white/5 text-zinc-300 text-xs font-medium rounded-md border border-white/10 hover:bg-white/10 transition-colors cursor-default">{tag}</span>
                ))}
              </div>
              <p className="text-zinc-400 leading-relaxed text-sm">{series.description}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Elenco Principal</h3>
              <div className="space-y-3">
                {series.cast.map(actor => (
                  <div key={actor} className="flex items-center gap-4 p-3 bg-black/20 rounded-xl border border-white/5 hover:bg-black/40 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300 ring-2 ring-black">
                      {actor[0]}
                    </div>
                    <span className="text-zinc-200 text-sm font-medium">{actor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COMMENTS TAB */}
        {activeTab === Tab.COMMENTS && (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-6 overflow-y-auto no-scrollbar">
              {series.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <img src={comment.avatar} alt={comment.user} className="w-9 h-9 rounded-full bg-zinc-800 object-cover ring-2 ring-black" />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-zinc-200">{comment.user}</span>
                      <span className="text-xs text-zinc-600">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{comment.text}</p>
                    <button className="mt-2 flex items-center gap-1.5 text-xs text-zinc-600 hover:text-rose-500 transition-colors">
                      <Sparkles className="w-3 h-3" /> {comment.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="p-4 bg-zinc-900/95 border-t border-white/5 sticky bottom-0 backdrop-blur-sm">
               <div className="relative">
                 <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Adicione um comentário..." 
                    className="w-full bg-black/50 text-white rounded-xl py-3 pl-4 pr-12 text-sm border border-white/10 focus:border-rose-600 focus:outline-none transition-colors placeholder:text-zinc-600"
                 />
                 <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-rose-600 rounded-lg text-white hover:bg-rose-700 transition-colors">
                   <MessageCircle className="w-4 h-4" />
                 </button>
               </div>
            </form>
          </div>
        )}

        {/* AI CHAT TAB */}
        {activeTab === Tab.AI_CHAT && (
          <div className="flex flex-col h-full bg-gradient-to-b from-zinc-900 to-purple-950/20">
            <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-4">
               <div className="w-12 h-12 rounded-full border-2 border-purple-500/50 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                 <img src="https://picsum.photos/seed/sofia/100/100" className="w-full h-full rounded-full object-cover" alt="Character" />
               </div>
               <div>
                 <h3 className="font-bold text-white text-base">Sofia Martins</h3>
                 <span className="text-xs text-purple-300 flex items-center gap-1.5">
                   <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                   Online agora
                 </span>
               </div>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-rose-600 text-white rounded-br-sm' 
                      : 'bg-zinc-800 text-zinc-200 rounded-bl-sm border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 rounded-2xl rounded-bl-none px-4 py-4 flex gap-1.5 items-center border border-white/5">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleChatSubmit} className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Pergunte sobre o segredo..."
                  className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 placeholder:text-zinc-600 transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!chatInput.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-600 to-rose-600 text-white px-4 rounded-xl disabled:opacity-50 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-center text-zinc-600 mt-3">
                IA Character Mode • Desenvolvido com Gemini
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};