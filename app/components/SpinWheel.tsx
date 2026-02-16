"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CharacterData } from "../../types/Character";


interface SpinWheelProps {
  onSpinFinish: (character: CharacterData) => void;
  onSpinClick: () => void;
  isSpinning: boolean;
  characterList: CharacterData[];
}

export default function SpinWheel({ onSpinFinish, onSpinClick, isSpinning, characterList }: SpinWheelProps) {
  const [displayCharacter, setDisplayCharacter] = useState<CharacterData | null>(null);
  const shuffleInterval = useRef<NodeJS.Timeout | null>(null);

  // --- UPDATED SIZES (BIGGER WHEEL) ---
  const WHEEL_SIZE = 520; 
  const CENTER_HOLE_SIZE = 200; 
  
  const getImageUrl = (path: string | null) => {
  // ✅ FIX: Instead of return null, return a default "no-image" path
  if (!path || path === "null" || path === "undefined" || path.length < 3) {
    return "/images/spin/Captain.png"; // Make sure this path exists!
  }
  
  if (path.startsWith("http")) return path;
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `http://localhost:5000${cleanPath}`;
};

  const activeChar = displayCharacter || (characterList.length > 0 ? characterList[0] : null);
  const currentImageSrc = activeChar ? getImageUrl(activeChar.image) : null;

  useEffect(() => {
    if (isSpinning) {
      shuffleInterval.current = setInterval(() => {
          if (characterList.length > 0) {
              const randomIndex = Math.floor(Math.random() * characterList.length);
              setDisplayCharacter(characterList[randomIndex]);
          }
      }, 80);

      const stopTimeout = setTimeout(() => {
        if (shuffleInterval.current) clearInterval(shuffleInterval.current);

        if (characterList && characterList.length > 0) {
            const winnerIndex = Math.floor(Math.random() * characterList.length);
            const winner = characterList[winnerIndex];
            setDisplayCharacter(winner); 
            onSpinFinish(winner);        
        } else {
            const dummy = { 
                id: 999, name: "Unknown", role: "Captain", bounty: "0", image: "/images/spin/Captain.png", 
                crew: "None", status: "Unknown", haki: [], devilFruit: "None"
            };
            setDisplayCharacter(dummy);
            onSpinFinish(dummy);
        }
      }, 3000);

      return () => {
          if (shuffleInterval.current) clearInterval(shuffleInterval.current);
          clearTimeout(stopTimeout);
      };
    }
  }, [isSpinning, onSpinFinish, characterList]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
      

      {/* 2. WHEEL FRAME */}
      <div className="absolute inset-0 z-30 pointer-events-none">
         <Image src="/images/spin/spin-wheel.png" alt="Wheel Frame" fill priority style={{ objectFit: "contain" }} />
      </div>

     {/* 3. CENTER BLACK CIRCLE + SHUFFLING IMAGE */}
      <div 
         className="wheel-center-hole absolute z-10 rounded-full bg-black overflow-hidden flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
         style={{ width: CENTER_HOLE_SIZE, height: CENTER_HOLE_SIZE }}
      >
          {currentImageSrc && (
              <Image 
                  src={currentImageSrc} 
                  alt="Character" 
                  fill 
                  className="object-cover object-top"
                  unoptimized={true} 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
          )}
      </div>
      {/* 4. SPIN BUTTON */}
      <div className="absolute -bottom-7.5 left-1/2 -translate-x-1/2 z-100">
         <button 
            onClick={onSpinClick}
            disabled={isSpinning}
            className={`transition-transform active:scale-95 hover:scale-105 ${isSpinning ? 'opacity-80 cursor-not-allowed' : ''}`}
            style={{ width: '310px', height: '140px', position: 'relative' }} 
         >
            <Image src="/images/spin/spin-button.png" alt="Spin" fill style={{ objectFit: "contain" }} />
         </button>
      </div>
    </div>
  );
}