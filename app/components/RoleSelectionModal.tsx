"use client";
import React, { useState } from "react";
import Image from "next/image";
import { CharacterData } from "@/utils/onePieceApi";

interface RoleModalProps {
  isOpen: boolean;
  character: CharacterData | null;
  takenRoles: string[]; // Roles already used by this player
  canSkip: boolean;
  onConfirm: (role: string) => void;
  onSkip: () => void;
}

const ROLES = ["Captain", "Vice-Captain", "Tank", "Support", "Healer"];

export default function RoleSelectionModal({ isOpen, character, takenRoles, canSkip, onConfirm, onSkip }: RoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  if (!isOpen || !character) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a0f0a] border-4 border-[#c89b3c] rounded-lg p-8 max-w-lg w-full text-center relative shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        
        {/* CHARACTER INFO */}
        <h2 className="text-3xl text-[#ffd700] font-bold mb-4 font-serif uppercase tracking-widest">Character Recruited!</h2>
        <div className="relative w-32 h-32 mx-auto mb-4 border-2 border-[#c89b3c] rounded-full overflow-hidden">
          <Image src={character.image} alt={character.name} fill style={{ objectFit: "cover" }} />
        </div>
        <h3 className="text-2xl text-white font-bold mb-1">{character.name}</h3>
        <p className="text-[#c89b3c] text-sm mb-6">Bounty: {character.bounty}</p>

        {/* ROLE SELECTION */}
        <div className="text-left mb-6">
          <p className="text-gray-400 text-sm mb-2 uppercase tracking-wide">Assign a Role:</p>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((role) => {
              const isTaken = takenRoles.includes(role);
              return (
                <label 
                  key={role}
                  className={`flex items-center space-x-2 p-3 rounded border transition-all cursor-pointer
                    ${isTaken 
                        ? "bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed" 
                        : selectedRole === role 
                            ? "bg-[#c89b3c]/20 border-[#c89b3c] text-white" 
                            : "bg-[#2a1a10] border-[#5d4037] text-gray-300 hover:border-[#8a5a20]"
                    }`}
                >
                  <input 
                    type="radio" 
                    name="role" 
                    value={role} 
                    disabled={isTaken}
                    checked={selectedRole === role}
                    onChange={() => setSelectedRole(role)}
                    className="accent-[#c89b3c]"
                  />
                  <span>{role}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 justify-center mt-8">
            {/* SKIP BUTTON */}
            {canSkip ? (
                 <button 
                    onClick={onSkip}
                    className="px-6 py-2 rounded bg-red-900/50 border border-red-500 text-red-200 hover:bg-red-800 transition-colors uppercase font-bold text-sm tracking-wider"
                 >
                    Skip & Re-Spin
                 </button>
            ) : (
                <button disabled className="px-6 py-2 rounded bg-gray-800 border border-gray-600 text-gray-500 cursor-not-allowed uppercase font-bold text-sm">
                    No Skips Left
                </button>
            )}
           
            {/* CONFIRM BUTTON */}
            <button 
                onClick={() => selectedRole && onConfirm(selectedRole)}
                disabled={!selectedRole}
                className={`px-8 py-2 rounded border uppercase font-bold text-sm tracking-wider transition-all
                    ${selectedRole 
                        ? "bg-[#c89b3c] border-[#ffd700] text-black hover:bg-[#ffb347] shadow-[0_0_15px_rgba(200,155,60,0.5)]" 
                        : "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
            >
                Confirm Role
            </button>
        </div>

      </div>
    </div>
  );
}