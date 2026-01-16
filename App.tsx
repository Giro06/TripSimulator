
import React, { useState, useEffect, useRef } from 'react';
import { Gender, Message, Partner, GameStatus } from './types';
import SelectionScreen from './components/SelectionScreen';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import EmojiPicker from './components/EmojiPicker';
import BlockedScreen from './components/BlockedScreen';
import { getPartnerResponse } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.SELECTION);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [irritationLevel, setIrritationLevel] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const checkAndFixKey = async () => {
    if (window.aistudio) {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
          return true;
        }
      } catch (e) {
        console.error("Key selection error:", e);
      }
    }
    return false;
  };

  const handlePartnerSelect = async (gender: Gender) => {
    await checkAndFixKey();

    const selectedPartner: Partner = {
      gender,
      name: 'Partnerim',
      avatar: gender === Gender.MALE 
        ? 'https://picsum.photos/seed/male_partner/200' 
        : 'https://picsum.photos/seed/female_partner/200'
    };
    setPartner(selectedPartner);
    setStatus(GameStatus.PLAYING);
    setErrorState(null);
    
    setTimeout(() => {
      const initialMsg: Message = {
        id: 'initial',
        text: 'Neredesin sen? Yarım saattir mesaj atmanı bekliyorum.',
        sender: 'partner',
        timestamp: new Date()
      };
      setMessages([initialMsg]);
    }, 1000);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const messageText = inputValue.trim();
    if (!messageText || status !== GameStatus.PLAYING || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setShowEmojiPicker(false);
    setIsTyping(true);
    setErrorState(null);

    try {
      const result = await getPartnerResponse(
        messageText,
        irritationLevel,
        partner?.gender || 'Bilinmiyor',
        partner?.name || 'Partner'
      );

      setIsTyping(false);
      
      const partnerMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: result.reply,
        sender: 'partner',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, partnerMsg]);
      
      const newIrritation = Math.max(0, Math.min(100, irritationLevel + (result.irritationIncrement || 5)));
      setIrritationLevel(newIrritation);

      if (newIrritation >= 100) {
        setTimeout(() => setStatus(GameStatus.BLOCKED), 1200);
      }
    } catch (err: any) {
      console.error("Chat Error:", err);
      setIsTyping(false);
      
      if (err.message === "API_KEY_NOT_FOUND" || err.message === "API_KEY_MISSING") {
        setErrorState("Bağlantı kısıtlı. LinkedIn/Mobil tarayıcı uyumluluğu için anahtarı yenileyin.");
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputValue(prev => prev + emoji);
  };

  const restartGame = () => {
    setStatus(GameStatus.SELECTION);
    setPartner(null);
    setMessages([]);
    setIrritationLevel(0);
    setInputValue('');
    setShowEmojiPicker(false);
    setErrorState(null);
  };

  if (status === GameStatus.SELECTION) {
    return <SelectionScreen onSelect={handlePartnerSelect} />;
  }

  return (
    <div className={`flex flex-col h-screen max-w-2xl mx-auto border-x border-gray-300 shadow-xl bg-white relative overflow-hidden ${status === GameStatus.BLOCKED ? 'animate-shake' : ''}`}>
      {partner && (
        <ChatHeader 
          partner={partner} 
          irritationLevel={irritationLevel} 
          isTyping={isTyping} 
          onFixKey={checkAndFixKey}
        />
      )}

      <div 
        className="flex-1 overflow-y-auto whatsapp-bg p-4 flex flex-col gap-2 relative"
        onClick={() => setShowEmojiPicker(false)}
      >
        {errorState && (
          <div 
            onClick={checkAndFixKey}
            className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg text-xs mb-2 text-center shadow-sm cursor-pointer hover:bg-orange-100 transition"
          >
            ⚠️ {errorState} <br/> <span className="font-bold underline text-[10px]">TIKLA VE YENİLE</span>
          </div>
        )}
        
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        
        {isTyping && (
          <div className="bg-white px-3 py-1 rounded-lg text-sm text-gray-700 w-max animate-pulse shadow-sm ml-2">
            {partner?.name} yazıyor...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="bg-[#f0f2f5] p-2 flex items-center gap-1 relative border-t">
        {showEmojiPicker && (
          <EmojiPicker 
            onEmojiSelect={handleEmojiSelect} 
            onClose={() => setShowEmojiPicker(false)} 
          />
        )}
        <button 
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`text-2xl w-10 h-10 flex items-center justify-center transition-colors ${showEmojiPicker ? 'text-[#00a884]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <i className="far fa-smile"></i>
        </button>
        <button className="text-gray-500 text-2xl w-10 h-10 flex items-center justify-center hover:text-gray-700">
          <i className="fas fa-plus"></i>
        </button>
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowEmojiPicker(false)}
            disabled={status === GameStatus.BLOCKED || isTyping}
            placeholder="Mesaj yazın"
            className="flex-1 p-3 rounded-full border-none focus:outline-none focus:ring-1 focus:ring-green-500 text-sm shadow-inner text-gray-900 bg-white"
          />
          <button 
            type="submit"
            disabled={status === GameStatus.BLOCKED || !inputValue.trim() || isTyping}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-sm active:scale-90 ${
              !inputValue.trim() || isTyping ? 'bg-gray-400' : 'bg-[#00a884] hover:bg-[#008f6f]'
            } text-white`}
          >
            <i className={`fas ${!inputValue.trim() || isTyping ? 'fa-microphone' : 'fa-paper-plane'}`}></i>
          </button>
        </form>
      </div>

      {/* INTERSTITIAL BLOCKED SCREEN */}
      {status === GameStatus.BLOCKED && partner && (
        <BlockedScreen 
          partner={partner} 
          messageCount={messages.length} 
          onRestart={restartGame} 
        />
      )}
    </div>
  );
};

export default App;
