"use client";
import Image from "next/image";
import { CharacterData } from "../../types/Character"; 

interface RoleSelectionModalProps {
  isOpen: boolean;
  character: CharacterData | null;
  takenRoles: string[];
  canSkip: boolean;
  onConfirm: (role: string) => void;
  onSkip: () => void;
}

export default function RoleSelectionModal({ 
    isOpen, character, takenRoles, canSkip, onConfirm, onSkip 
}: RoleSelectionModalProps) {
    
  if (!isOpen || !character) return null;

  // --- HELPER: FIX IMAGE URLS ---
  const getImageUrl = (path: string | null) => {
      if (!path || path === "null" || path === "undefined") return "/images/spin/Captain.png";
      if (path.startsWith("http")) return path;
      return `http://localhost:5000${path}`;
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative bg-[#505050] border-2 border-[#fbbf24] rounded-xl w-150 h-87.5 flex shadow-2xl overflow-hidden">
        
        {/* LEFT: CHARACTER */}
        <div className="w-[40%] h-full p-4 flex flex-col items-center justify-center border-r border-gray-600 bg-[#444]">
           
           {/* IMAGE FRAME - Made Taller (3:4) and Aligned to TOP */}
           <div className="relative w-full aspect-3/4 border-[3px] border-[#3b82f6] rounded bg-black mb-3 overflow-hidden shadow-inner">
             <Image 
               src={getImageUrl(character.image)}
               alt={character.name}
               fill
               // FIX: object-top keeps the head visible
               className="object-cover object-top" 
               unoptimized={true}
               onError={(e) => { e.currentTarget.style.display = 'none'; }}
             />
           </div>

           <h2 className="text-[#fbbf24] text-xl font-black uppercase tracking-wider text-center font-sans leading-tight drop-shadow-md">
             {character.name}
           </h2>
        </div>

        {/* RIGHT: BUTTONS */}
        <div className="w-[60%] h-full p-6 flex flex-col justify-between bg-[#404040]">
            <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                    <RoleButton role="Captain" takenRoles={takenRoles} onClick={() => onConfirm("Captain")} />
                    <RoleButton role="Vice-Captain" takenRoles={takenRoles} onClick={() => onConfirm("Vice-Captain")} />
                </div>
                <div className="flex gap-3">
                    <RoleButton role="Tank" takenRoles={takenRoles} onClick={() => onConfirm("Tank")} />
                    <RoleButton role="Support" takenRoles={takenRoles} onClick={() => onConfirm("Support")} />
                </div>
                <div className="flex justify-center">
                    <RoleButton role="Healer" takenRoles={takenRoles} onClick={() => onConfirm("Healer")} className="w-35" />
                </div>
            </div>

            <div className="flex justify-center mt-2">
                <button
                    onClick={onSkip}
                    disabled={!canSkip}
                    className={`
                        px-8 py-1.5 bg-black text-[#ff0000] font-black uppercase tracking-wider rounded text-sm hover:bg-gray-900 transition-colors border border-red-900/30
                        ${!canSkip && "opacity-50 cursor-not-allowed text-gray-500"}
                    `}
                >
                    {canSkip ? "SKIP CHARACTER" : "NO SKIPS LEFT"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

interface RoleButtonProps { role: string; takenRoles: string[]; onClick: () => void; className?: string; }
function RoleButton({ role, takenRoles, onClick, className = "flex-1" }: RoleButtonProps) {
    const isTaken = takenRoles.includes(role);
    return (
        <button
            onClick={onClick}
            disabled={isTaken}
            className={`
                ${className} py-3 bg-black text-white font-bold uppercase text-xs tracking-wider rounded shadow-md border border-gray-700
                ${isTaken ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-gray-900 hover:scale-105 active:scale-95 transition-transform hover:border-gray-500"}
            `}
        >
            {role}
        </button>
    );
}