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
  const [rotation, setRotation] = useState(0);
  const currentRotation = useRef(0);

  // --- SETTINGS ---
  const WHEEL_SIZE = 400; 
  const CENTER_HOLE_SIZE = 220; 
  const ICON_SIZE = 75;    
  
  const safeList = characterList && characterList.length > 0 ? characterList.slice(0, 12) : [];
  const angleStep = 360 / (safeList.length || 1);

  // --- IMAGE URL FIXER ---
  const getImageUrl = (path: string | null) => {
      // 1. If path is totally missing, return null (don't try to load anything)
      if (!path || path === "null" || path === "undefined" || path.length < 3) return null;

      // 2. If it's a web link, keep it
      if (path.startsWith("http")) return path;

      // 3. Fix missing slash and point to Backend Port 5000
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `http://localhost:5000${cleanPath}`;
  };

  useEffect(() => {
    if (isSpinning) {
      const newAngle = currentRotation.current + 1800 + Math.random() * 360;
      setRotation(newAngle);
      currentRotation.current = newAngle;

      const timeout = setTimeout(() => {
        if (characterList && characterList.length > 0) {
            const randomIndex = Math.floor(Math.random() * characterList.length);
            onSpinFinish(characterList[randomIndex]);
        }
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isSpinning, onSpinFinish, characterList]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
      
      

      {/* 2. WHEEL FRAME */}
      <div className="absolute inset-0 z-30 pointer-events-none">
         <Image 
            src="/images/spin/spin-wheel.png" 
            alt="Wheel Frame" 
            fill 
            priority
            style={{ objectFit: "contain" }} 
        />
      </div>

      {/* 3. CENTER BACKGROUND (SINGLE BLACK CIRCLE) */}
      <div 
         className="absolute z-10 rounded-full bg-black shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
         style={{ width: CENTER_HOLE_SIZE, height: CENTER_HOLE_SIZE }}
      />

      {/* 4. SPIN BUTTON (Overlapping the Bottom Golden Point) */}
      <div className="absolute bottom-[-55px] left-1/2 -translate-x-1/2 z-50">
         <button 
            onClick={onSpinClick}
            disabled={isSpinning}
            className={`transition-transform active:scale-95 hover:scale-105 ${isSpinning ? 'opacity-80 cursor-not-allowed' : ''}`}
            style={{ width: '240px', height: '140px', position: 'relative' }} 
         >
            <Image src="/images/spin/spin-button.png" alt="Spin" fill style={{ objectFit: "contain" }} />
         </button>
      </div>

      {/* 5. SPINNING CHARACTERS */}
      <div 
        className="absolute z-20 transition-transform duration-[3000ms] ease-out will-change-transform flex items-center justify-center"
        style={{ 
            width: CENTER_HOLE_SIZE, 
            height: CENTER_HOLE_SIZE,
            transform: `rotate(${rotation}deg)` 
        }}
      >
          {safeList.map((char, index) => {
              const angleDeg = index * angleStep;
              const angleRad = (angleDeg * Math.PI) / 180;
              const radius = 70; 
              const x = radius * Math.cos(angleRad);
              const y = radius * Math.sin(angleRad);
              
              const validSrc = getImageUrl(char.image);

              return (
                <div 
                    key={char.id || index}
                    className="absolute rounded-full overflow-hidden" 
                    // REMOVED 'border' HERE TO FIX THE MESSY YELLOW LINES
                    style={{
                        width: `${ICON_SIZE}px`,
                        height: `${ICON_SIZE}px`,
                        transform: `translate(${x}px, ${y}px) rotate(${-rotation}deg)` 
                    }}
                >
                    {validSrc && (
                        <Image 
                            src={validSrc} 
                            alt={char.name} 
                            fill 
                            style={{ objectFit: "cover" }}
                            unoptimized={true} 
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    )}
                </div>
              );
          })}
      </div>
    </div>
  );
}