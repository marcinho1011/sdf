import React from 'react';
import { Lock, X, Check } from 'lucide-react';
import { COIN_PACKAGES } from '../constants';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  requiredCoins: number;
  currentCoins: number;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({ isOpen, onClose, onUnlock, requiredCoins, currentCoins }) => {
  if (!isOpen) return null;

  const canAfford = currentCoins >= requiredCoins;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/40">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="p-1.5 bg-rose-500/20 rounded-lg">
               <Lock className="w-4 h-4 text-rose-500" /> 
            </div>
            Desbloquear Episódio
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-8">
            <p className="text-zinc-400 mb-4 text-sm">Este é um episódio <span className="text-rose-400 font-medium">Premium</span>.</p>
            <div className="inline-flex items-center gap-3 bg-zinc-950 px-6 py-3 rounded-2xl border border-white/5 shadow-inner">
              <span className="text-yellow-400 font-bold text-xl">{requiredCoins} Moedas</span>
              <span className="text-zinc-600 text-xs uppercase tracking-wider font-bold">Necessárias</span>
            </div>
            <p className="text-xs text-zinc-500 mt-3 font-medium">Seu saldo atual: <span className="text-white">{currentCoins}</span></p>
          </div>

          {canAfford ? (
             <button 
               onClick={onUnlock}
               className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold transition-all active:scale-95 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.3)]"
             >
               <Lock className="w-5 h-5" /> Desbloquear Episódio
             </button>
          ) : (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 text-center">Recarregar Moedas</p>
              {COIN_PACKAGES.map((pkg, idx) => (
                <button key={idx} className="w-full flex justify-between items-center p-4 rounded-2xl border border-white/5 bg-zinc-800/30 hover:bg-zinc-800 hover:border-yellow-500/30 transition-all group">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold text-sm border border-yellow-500/20 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                       C
                     </div>
                     <div className="text-left">
                       <div className="font-bold text-white text-sm group-hover:text-yellow-400 transition-colors">{pkg.amount} Moedas</div>
                       {pkg.bonus > 0 && <div className="text-[10px] text-green-400 font-medium bg-green-400/10 px-2 py-0.5 rounded-full inline-block mt-1">+{pkg.bonus} Bônus</div>}
                     </div>
                  </div>
                  <div className="bg-white text-black font-bold px-4 py-2 rounded-xl text-sm group-hover:bg-yellow-400 transition-colors shadow-sm">
                    {pkg.price}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};