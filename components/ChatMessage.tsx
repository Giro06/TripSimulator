
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex w-full mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[85%] px-3 py-1.5 rounded-lg shadow-sm text-sm relative ${
          isUser 
            ? 'bg-[#dcf8c6] rounded-tr-none' 
            : 'bg-white rounded-tl-none'
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-gray-900 font-medium">
          {message.text}
        </p>
        <div className="text-[10px] text-gray-500 text-right mt-1 flex items-center justify-end gap-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isUser && <i className="fas fa-check-double text-blue-500"></i>}
        </div>
        
        {/* Tail effect */}
        <div 
          className={`absolute top-0 w-3 h-3 ${
            isUser 
              ? 'bg-[#dcf8c6] -right-2' 
              : 'bg-white -left-2'
          }`}
          style={{
            clipPath: isUser 
              ? 'polygon(0 0, 0 100%, 100% 0)' 
              : 'polygon(100% 0, 100% 100%, 0 0)'
          }}
        ></div>
      </div>
    </div>
  );
};

export default ChatMessage;
