import React from 'react';
import { Search, Bell, User, Coins } from 'lucide-react';

interface HeaderProps {
  coins: number;
  onAddCoins: () => void;
}

export const Header: React.FC<HeaderProps> = ({ coins, onAddCoins }) => {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.4)]">
          <span className="font-bold text-white text-lg">D</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
          Drama<span className="text-rose-500">Shorts</span>
        </span>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-zinc-400 transition-colors w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar séries, episódios..." 
            className="w-full bg-zinc-900/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-rose-500 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onAddCoins}
          className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-600/20 to-yellow-500/10 hover:from-yellow-600/30 hover:to-yellow-500/20 px-3 py-1.5 rounded-full transition-all border border-yellow-500/30 group"
        >
          <Coins className="w-4 h-4 text-yellow-500 fill-yellow-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-yellow-200">{coins}</span>
          <div className="w-4 h-4 rounded-full bg-yellow-500 text-black text-[10px] font-bold flex items-center justify-center ml-1">+</div>
        </button>
        
        <button className="text-zinc-400 hover:text-white transition-colors relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
        <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden border border-zinc-700 cursor-pointer hover:border-zinc-500 transition-colors">
          <User className="w-5 h-5 text-zinc-400" />
        </div>
      </div>
    </header>
  );
};