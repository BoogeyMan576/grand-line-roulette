import React from "react";
import Image from "next/image";
import { CharacterData } from "../../types/Character";

interface CharacterSlotProps {
  role: string;
  character: CharacterData | null;
  isCurrentTurn: boolean;
}

const getImageUrl = (path: string) => {
  if (!path) return "/images/placeholder.png"; 
  if (path.startsWith("http")) return path;
  return path;
};

const CharacterSlot: React.FC<CharacterSlotProps> = ({ role, character, isCurrentTurn }) => {
  return (
    <div
      className={`
        relative flex flex-col items-center justify-center 
        transition-all duration-300 border-2 rounded-lg overflow-hidden
        
        /* --- RESPONSIVE SIZING --- */
        w-24 h-32        /* Mobile: Small */
        md:w-32 md:h-44  /* Tablet: Medium */
        lg:w-40 lg:h-56  /* Desktop: Large */
        
        /* --- BORDER COLOR --- */
        ${isCurrentTurn 
          ? "border-yellow-400 shadow-[0_0_15px_gold] scale-105 z-10" 
          : "border-gray-600 bg-black/40 hover:border-gray-400"
        }
      `}
    >
      {character ? (
        <>
          {/* Character Image */}
          <div className="relative w-full h-full">
            <Image
              src={getImageUrl(character.image)}
              alt={character.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100px, 200px" 
            />
            
            {/* Name Tag (Bottom) */}
            <div className="absolute bottom-0 w-full bg-black/70 text-center py-1">
              <p className="text-[10px] md:text-xs text-white font-bold truncate px-1">
                {character.name}
              </p>
            </div>
          </div>
          
          {/* Rarity Badge (Top Right) */}
          <div className="absolute top-1 right-1 bg-yellow-600 text-white text-[8px] md:text-[10px] px-1 rounded border border-white/20 shadow-md">
            {character.bounty || "Unknown"}
          </div>
        </>
      ) : (
        /* Empty Slot Placeholder */
        <div className="flex flex-col items-center justify-center opacity-50">
           {/* You can replace this text with an icon if you want */}
           <span className="text-2xl md:text-4xl">?</span>
           <span className="text-[10px] md:text-xs uppercase mt-1 tracking-widest">{role}</span>
        </div>
      )}
    </div>
  );
};

export default CharacterSlot;