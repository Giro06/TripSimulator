
import React, { useState, useEffect, useRef } from 'react';
import { Gender, Message, Partner, GameStatus } from './types';
import SelectionScreen from './components/SelectionScreen';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import { getPartnerResponse } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.SELECTION);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [irritationLevel, setIrritationLevel] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handlePartnerSelect = (gender: Gender) => {
    const selectedPartner: Partner = {
      gender,
      name: 'Partnerim',
      avatar: gender === Gender.MALE 
        ? 'https://picsum.photos/seed/male_partner/200' 
        : 'https://picsum.photos/seed/female_partner/200'
    };
    setPartner(selectedPartner);
    setStatus(GameStatus.PLAYING);
    
    // Initial message
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
    if (!inputValue.trim() || status !== GameStatus.PLAYING) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const result = await getPartnerResponse(
      inputValue,
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
    
    const newIrritation = Math.min(100, irritationLevel + result.irritationIncrement);
    setIrritationLevel(newIrritation);

    if (newIrritation >= 100) {
      setTimeout(() => {
        setStatus(GameStatus.BLOCKED);
      }, 1000);
    }
  };

  const restartGame = () => {
    setStatus(GameStatus.SELECTION);
    setPartner(null);
    setMessages([]);
    setIrritationLevel(0);
    setInputValue('');
  };

  if (status === GameStatus.SELECTION) {
    return <SelectionScreen onSelect={handlePartnerSelect} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border-x border-gray-300 shadow-xl bg-white">
      {partner && (
        <ChatHeader 
          partner={partner} 
          irritationLevel={irritationLevel} 
          isTyping={isTyping} 
        />
      )}

      <div className="flex-1 overflow-y-auto whatsapp-bg p-4 flex flex-col gap-2 relative">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="bg-white px-3 py-1 rounded-lg text-sm text-gray-700 w-max animate-pulse">
            {partner?.name} yazıyor...
          </div>
        )}
        {status === GameStatus.BLOCKED && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 text-center z-10 shadow-lg">
            <strong className="font-bold text-xl block mb-2">ENGELLEDİN!</strong>
            <p className="block"> {partner?.name} artık seninle konuşmak istemiyor.</p>
            <div className="mt-4 p-2 bg-white/50 rounded">
              <span className="text-sm font-bold text-gray-800">Dayanılan Mesaj Sayısı: {messages.length}</span>
              <button 
                onClick={restartGame}
                className="block mx-auto mt-3 bg-red-600 text-white font-bold px-6 py-2 rounded-full hover:bg-red-700 transition shadow-md"
              >
                Yeniden Dene
              </button>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="bg-[#f0f2f5] p-2 flex items-center gap-2">
        <button className="text-gray-500 text-2xl px-2">
          <i className="far fa-smile"></i>
        </button>
        <button className="text-gray-500 text-2xl px-2">
          <i className="fas fa-plus"></i>
        </button>
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={status === GameStatus.BLOCKED || isTyping}
            placeholder="Mesaj yazın"
            className="flex-1 p-3 rounded-full border-none focus:outline-none focus:ring-1 focus:ring-green-500 text-sm shadow-sm text-gray-900 bg-white"
          />
          <button 
            type="submit"
            disabled={status === GameStatus.BLOCKED || !inputValue.trim() || isTyping}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
              !inputValue.trim() ? 'bg-gray-400' : 'bg-[#00a884] hover:bg-[#008f6f]'
            } text-white`}
          >
            <i className={`fas ${!inputValue.trim() ? 'fa-microphone' : 'fa-paper-plane'}`}></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
