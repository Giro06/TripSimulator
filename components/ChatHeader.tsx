
import React from 'react';
import { Partner } from '../types';

interface ChatHeaderProps {
  partner: Partner;
  irritationLevel: number;
  isTyping: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ partner, irritationLevel, isTyping }) => {
  const getStatusText = () => {
    if (isTyping) return 'yazıyor...';
    if (irritationLevel < 30) return 'Çevrimiçi';
    if (irritationLevel < 70) return 'Trip Atıyor...';
    if (irritationLevel < 100) return 'Çok Sinirli!';
    return 'Engellendin';
  };

  return (
    <div className="bg-[#075e54] text-white p-3 flex items-center shadow-md relative">
      <div className="flex items-center flex-1">
        <button className="mr-4 text-xl">
          <i className="fas fa-arrow-left"></i>
        </button>
        <img 
          src={partner.avatar} 
          alt={partner.name} 
          className="w-10 h-10 rounded-full mr-3 border border-white/20"
        />
        <div>
          <h2 className="font-bold leading-tight">{partner.name}</h2>
          <p className="text-xs text-white/80">{getStatusText()}</p>
        </div>
      </div>
      <div className="flex gap-5 items-center">
        <i className="fas fa-video"></i>
        <i className="fas fa-phone"></i>
        <i className="fas fa-ellipsis-v"></i>
      </div>

      {/* Irritation Meter (Custom feature) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 overflow-hidden">
        <div 
          className="h-full bg-red-500 transition-all duration-500" 
          style={{ width: `${irritationLevel}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ChatHeader;
