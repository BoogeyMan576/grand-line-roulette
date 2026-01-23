"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getRandomCharacter, CharacterData } from "../../data/characters";

// FIX: Using a safe image to stop the 404 errors shown in your screenshot
const SAFE_IMAGE = "/images/spin/Captain.png"; 

interface SpinWheelProps {
  onSpinFinish: (character: CharacterData) => void; 
  isSpinning: boolean;
}

export default function SpinWheel({ onSpinFinish, isSpinning }: SpinWheelProps) {
  const [displayImage, setDisplayImage] = useState("/images/spin/vs.png");

  useEffect(() => {
    if (isSpinning) {
      // 1. Simple visual toggle
      const shuffleInterval = setInterval(() => {
         // Toggles opacity or similar effect could go here
         // For now, keep image static to prevent 404 flashing
      }, 100);

      // 2. Stop after 3 seconds
      const timer = setTimeout(() => {
        clearInterval(shuffleInterval);
        const winner = getRandomCharacter();
        // If the winner's image is missing, it will default to the safe one in the Image component below
        setDisplayImage(winner.image); 
        onSpinFinish(winner);
      }, 3000);

      return () => { clearInterval(shuffleInterval); clearTimeout(timer); };
    }
  }, [isSpinning, onSpinFinish]);

  return (
    <div className="relative w-[450px] h-[450px] flex justify-center items-center">
      <div className="absolute inset-0 z-20 pointer-events-none">
        <Image src="/images/spin/spin-wheel.png" alt="Wheel" fill style={{ objectFit: "contain" }} priority />
      </div>
      
      <div className="absolute z-10 w-[150px] h-[150px] rounded-full overflow-hidden bg-black">
         <Image 
            src={displayImage} 
            alt="Character" 
            fill 
            style={{ objectFit: "cover" }} 
            // Fallback to prevent crash if image is missing
            onError={(e) => { e.currentTarget.src = SAFE_IMAGE; }}
         />
      </div>
    </div>
  );
}