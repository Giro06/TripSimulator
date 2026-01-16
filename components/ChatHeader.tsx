
import React from 'react';
import { Partner } from '../types';

interface ChatHeaderProps {
  partner: Partner;
  irritationLevel: number;
  isTyping: boolean;
  onFixKey?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ partner, irritationLevel, isTyping, onFixKey }) => {
  const getStatusInfo = () => {
    if (isTyping) return { text: 'yazıyor...', color: 'text-white/80', icon: 'fa-pen' };
    if (irritationLevel < 30) return { text: 'Çevrimiçi', color: 'text-green-300', icon: 'fa-circle text-[8px]' };
    if (irritationLevel < 50) return { text: 'Biraz dalgın...', color: 'text-green-100', icon: 'fa-circle text-[8px]' };
    if (irritationLevel < 70) return { text: 'Trip Atıyor...', color: 'text-orange-300', icon: 'fa-face-rolling-eyes' };
    if (irritationLevel < 90) return { text: 'Çok Sinirli!', color: 'text-red-300', icon: 'fa-fire' };
    return { text: 'Engellemek üzere!', color: 'text-red-500 font-black animate-pulse', icon: 'fa-skull-crossbones' };
  };

  const status = getStatusInfo();

  // Dinamik bar rengi, animasyonu ve gölge efektlerini hesaplama
  const getBarStyles = () => {
    // Kritik Seviye (%90+)
    if (irritationLevel >= 90) {
      return 'bg-red-700 shadow-[0_0_15px_rgba(220,38,38,1)] animate-[pulse_0.4s_ease-in-out_infinite] scale-y-110';
    }
    // Çok Tehlikeli (%80+)
    if (irritationLevel >= 80) {
      return 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.7)] animate-[pulse_0.8s_ease-in-out_infinite]';
    }
    // Tehlikeli Seviye (%50+)
    if (irritationLevel >= 50) {
      return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)] animate-[pulse_2s_ease-in-out_infinite]';
    }
    // Uyarı Seviyesi (%30+)
    if (irritationLevel >= 30) {
      return 'bg-yellow-400';
    }
    // Sakin Seviye
    return 'bg-green-400';
  };

  return (
    <div className="bg-[#075e54] text-white p-3 flex items-center shadow-md relative z-20">
      <div className="flex items-center flex-1">
        <button className="mr-3 text-xl transition-transform active:scale-90">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="relative">
          <img 
            src={partner.avatar} 
            alt={partner.name} 
            className={`w-10 h-10 rounded-full mr-3 border-2 transition-all duration-500 object-cover ${
              irritationLevel > 80 ? 'border-red-600 shadow-[0_0_10px_red]' : 
              irritationLevel > 50 ? 'border-orange-400 shadow-[0_0_5px_orange]' : 
              'border-white/20'
            }`}
          />
          <div className={`absolute bottom-0 right-3 w-3.5 h-3.5 border-2 border-[#075e54] rounded-full transition-all duration-500 ${
            irritationLevel > 80 ? 'bg-red-600 animate-ping' : 
            irritationLevel > 50 ? 'bg-orange-500' : 'bg-green-500'
          }`}></div>
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold leading-tight text-sm sm:text-base">{partner.name}</h2>
          <div className="flex items-center gap-1.5">
            <i className={`fas ${status.icon} text-[10px] ${status.color} transition-all duration-300`}></i>
            <p className={`text-[10px] sm:text-xs transition-colors duration-300 ${status.color}`}>{status.text}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <i className={`fas fa-video cursor-pointer transition-opacity ${irritationLevel > 80 ? 'opacity-20 pointer-events-none' : 'opacity-80 hover:opacity-100'}`}></i>
        <i className={`fas fa-phone cursor-pointer transition-opacity ${irritationLevel > 80 ? 'opacity-20 pointer-events-none' : 'opacity-80 hover:opacity-100'}`}></i>
        <button onClick={onFixKey} className="hover:bg-white/10 p-2 rounded-full transition-colors relative">
          <i className="fas fa-ellipsis-v"></i>
          {irritationLevel > 90 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* Dinamik Irritation Meter */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black/40 overflow-hidden">
        <div 
          className={`h-full transition-all duration-700 ease-out relative origin-left ${getBarStyles()}`} 
          style={{ width: `${irritationLevel}%` }}
        >
          {/* Ekstra Parlama Efekti (Shimmer) */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite] w-full h-full" style={{ backgroundSize: '200% 100%' }}></div>
          
          {/* Kritik Seviye Çatlama Efekti (Sadece %80 üstü) */}
          {irritationLevel > 80 && (
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-custom {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(1.3); }
        }
      `}</style>
    </div>
  );
};

export default ChatHeader;
