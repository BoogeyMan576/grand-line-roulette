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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative bg-[#505050] border-2 border-[#fbbf24] rounded-xl w-[600px] h-[320px] flex shadow-2xl overflow-hidden">
        
        {/* LEFT: CHARACTER */}
        <div className="w-[35%] h-full p-4 flex flex-col items-center justify-center border-r border-gray-600">
           <div className="relative w-full aspect-square border-[3px] border-[#3b82f6] rounded bg-black mb-3 overflow-hidden">
             <Image 
               src={getImageUrl(character.image)}
               alt={character.name}
               fill
               className="object-cover"
               unoptimized={true}
               onError={(e) => { e.currentTarget.style.display = 'none'; }}
             />
           </div>
           <h2 className="text-[#fbbf24] text-xl font-black uppercase tracking-wider text-center font-sans leading-tight">
             {character.name}
           </h2>
        </div>

        {/* RIGHT: BUTTONS */}
        <div className="w-[65%] h-full p-6 flex flex-col justify-between bg-[#404040]">
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
                    <RoleButton role="Healer" takenRoles={takenRoles} onClick={() => onConfirm("Healer")} className="w-[140px]" />
                </div>
            </div>

            <div className="flex justify-center mt-2">
                <button
                    onClick={onSkip}
                    disabled={!canSkip}
                    className={`
                        px-8 py-1.5 bg-black text-[#ff0000] font-black uppercase tracking-wider rounded text-sm hover:bg-gray-900 transition-colors
                        ${!canSkip && "opacity-50 cursor-not-allowed"}
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
                ${className} py-2 bg-black text-white font-bold uppercase text-xs tracking-wider rounded shadow-md
                ${isTaken ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-gray-900 hover:scale-105 active:scale-95 transition-transform"}
            `}
        >
            {role}
        </button>
    );
}