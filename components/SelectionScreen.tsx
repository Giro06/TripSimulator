
import React from 'react';
import { Gender } from '../types';

interface SelectionScreenProps {
  onSelect: (gender: Gender) => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#075e54] to-[#128c7e] text-white p-6 text-center">
      <div className="mb-8 animate-bounce">
        <i className="fab fa-whatsapp text-7xl"></i>
      </div>
      <h1 className="text-3xl font-bold mb-2">Tripli Partner Simülatörü</h1>
      <p className="text-white/90 mb-10 max-w-sm font-medium">
        Partnerin bugün çok huysuz! Bakalım ne kadar süre alttan alabileceksin yoksa engeli mi yiyeceksin?
      </p>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        <button
          onClick={() => onSelect(Gender.MALE)}
          className="flex-1 bg-white hover:bg-gray-100 p-8 rounded-2xl transition-all group shadow-xl"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🧔‍♂️</div>
          <span className="text-xl font-bold text-gray-900">Erkek Partner</span>
          <p className="text-xs text-gray-500 mt-2 font-semibold italic">Maceraya başla</p>
        </button>

        <button
          onClick={() => onSelect(Gender.FEMALE)}
          className="flex-1 bg-white hover:bg-gray-100 p-8 rounded-2xl transition-all group shadow-xl"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">👩‍💼</div>
          <span className="text-xl font-bold text-gray-900">Kadın Partner</span>
          <p className="text-xs text-gray-500 mt-2 font-semibold italic">Maceraya başla</p>
        </button>
      </div>
      
      <div className="mt-12 text-xs text-white/60 font-medium">
        Gerçek ilişki tavsiyesi içermez. Sadece eğlence amaçlıdır.
      </div>
    </div>
  );
};

export default SelectionScreen;
