
import React, { useEffect, useState } from 'react';
import { Partner } from '../types';

interface BlockedScreenProps {
  partner: Partner;
  messageCount: number;
  onRestart: () => void;
}

const BlockedScreen: React.FC<BlockedScreenProps> = ({ partner, messageCount, onRestart }) => {
  const [showStats, setShowStats] = useState(false);
  const [isAdVisible, setIsAdVisible] = useState(true);
  const [adCountdown, setAdCountdown] = useState(5);
  const [adStatus, setAdStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    // Google Adsense tetikleme
    try {
      // @ts-ignore
      if (window.adsbygoogle) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdStatus('loaded');
      }
    } catch (e) {
      console.error("AdSense push error:", e);
      setAdStatus('error');
    }

    if (isAdVisible && adCountdown > 0) {
      const timer = setTimeout(() => setAdCountdown(adCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [adCountdown, isAdVisible]);

  useEffect(() => {
    if (!isAdVisible) {
      const timer = setTimeout(() => setShowStats(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isAdVisible]);

  const closeAd = () => {
    if (adCountdown === 0) {
      setIsAdVisible(false);
    }
  };

  if (isAdVisible) {
    return (
      <div className="absolute inset-0 z-[200] bg-[#f8f9fa] flex flex-col animate-in fade-in duration-300">
        {/* Ad Header */}
        <div className="p-3 flex justify-between items-center bg-white border-b shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-sans border px-1.5 py-0.5 rounded uppercase tracking-wider">Reklam</span>
            {adStatus === 'loading' && <i className="fas fa-circle-notch animate-spin text-blue-500 text-[10px]"></i>}
          </div>
          <button 
            onClick={closeAd}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              adCountdown > 0 
                ? 'text-gray-400 bg-gray-100' 
                : 'text-white bg-[#007bff] hover:bg-[#0056b3] active:scale-95'
            }`}
          >
            {adCountdown > 0 ? (
              <>Kapatmak için bekleyin ({adCountdown})</>
            ) : (
              <>REKLAMI KAPAT <i className="fas fa-times"></i></>
            )}
          </button>
        </div>

        {/* Ad Body */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-[336px] bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 flex flex-col" style={{ minHeight: '280px' }}>
            <div className="flex-1 relative flex items-center justify-center bg-gray-50">
              {/* REAL ADSENSE TAG */}
              {/* Not: data-adtest="on" gerçek reklam yerine test reklamı gösterilmesini sağlar (Sadece geliştirme aşamasında kullanın) */}
              <ins className="adsbygoogle"
                   style={{ display: 'block', width: '336px', height: '280px' }}
                   data-ad-client="ca-pub-7657412837781109"
                   data-ad-slot="default"
                   data-ad-format="rectangle"
                   data-full-width-responsive="true"
                   data-adtest="on">
              </ins>
              
              {/* Overlay shown only if AdSense doesn't fill the slot (Loading State) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-gray-50/80 z-[-1]">
                <i className="fas fa-bolt text-4xl text-yellow-400 mb-3 opacity-20"></i>
                <p className="text-gray-300 text-[10px] uppercase font-bold tracking-[0.2em]">Reklam Yükleniyor...</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center max-w-[280px]">
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
              Destekleriniz için teşekkürler! Reklam bittiğinde skorunuzu görebilirsiniz.
            </p>
          </div>
        </div>

        {/* Ad Footer */}
        <div className="p-4 flex justify-center items-center gap-2 opacity-40">
           <img src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg" alt="Google" className="h-4" />
           <span className="text-[10px] text-gray-500 font-medium">Reklamları</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative animate-in zoom-in slide-in-from-bottom-12 duration-500">
        <div className="h-32 bg-gradient-to-br from-red-600 to-rose-800 relative flex items-center justify-center">
          <div className="absolute top-4 right-6 text-white/10 text-7xl rotate-12">
            <i className="fas fa-ban"></i>
          </div>
          <div className="relative">
             <img 
              src={partner.avatar} 
              alt={partner.name} 
              className="w-20 h-20 rounded-full border-4 border-white shadow-2xl object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white text-[10px]">
              <i className="fas fa-user-slash"></i>
            </div>
          </div>
        </div>

        <div className="p-10 pt-8 text-center">
          <div className="mb-6 relative h-16 flex items-center justify-center">
            <div className="border-[5px] border-red-600 text-red-600 font-black text-4xl px-8 py-2 uppercase tracking-tighter rotate-[-8deg] animate-stamp shadow-xl bg-white/95 z-10 select-none">
              ENGELLEDİN
            </div>
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Oyun Bitti!</h3>
          <p className="text-sm text-gray-500 mb-10 px-2 leading-relaxed font-medium">
            Maalesef {partner.name} daha fazla dayanamadı. Biraz ara versen iyi olur.
          </p>

          <div className={`grid grid-cols-2 gap-4 mb-10 transition-all duration-1000 delay-300 ${showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Skor</div>
              <div className="text-3xl font-black text-[#075e54]">{messageCount}</div>
              <div className="text-[10px] text-gray-400 mt-1">Mesaj</div>
            </div>
            <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Durum</div>
              <div className="text-xs font-black text-red-600 uppercase mt-2">Engellendi</div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onRestart}
              className="w-full bg-[#075e54] text-white font-bold px-6 py-5 rounded-2xl hover:bg-[#128c7e] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 text-lg"
            >
              <i className="fas fa-play-circle text-xl"></i>
              Tekrar Dene
            </button>
            <button 
              className="w-full text-gray-400 font-bold px-6 py-2 rounded-2xl hover:text-gray-600 transition-all text-xs flex items-center justify-center gap-2"
              onClick={() => {
                const text = `Tripli Partner simülatöründe ${messageCount} mesaj dayanabildim! Sen ne kadar dayanabilirsin?`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
              }}
            >
              <i className="fab fa-whatsapp"></i>
              Skoru Paylaş
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedScreen;
