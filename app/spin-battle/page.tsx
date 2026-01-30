"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import WelcomeModal from "../components/WelcomeModal";
import BattleInfoPanel from "../components/BattleInfoPanel";
import SpinWheel from "../components/SpinWheel";
import RoleSelectionModal from "../components/RoleSelectionModal";
import { fetchCharacters } from "../../utils/onePieceApi";
import { CharacterData } from "../../types/Character";

type Team = { [key: string]: CharacterData | null; };

const INITIAL_TEAM: Team = {
    "Captain": null, "Vice-Captain": null, "Tank": null, "Support": null, "Healer": null
};

export default function SpinBattle() {
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  }, []);

  const [characterList, setCharacterList] = useState<CharacterData[]>([]);
  const [p1Power, setP1Power] = useState(0);
  const [p2Power, setP2Power] = useState(0);
  const [logs, setLogs] = useState<string[]>(["Welcome to the Grand Line! Spin to recruit."]);
  
  const [currentTurn, setCurrentTurn] = useState<'p1' | 'p2'>('p1');
  const [isSpinning, setIsSpinning] = useState(false);
  
  const [p1Team, setP1Team] = useState<Team>({ ...INITIAL_TEAM });
  const [p2Team, setP2Team] = useState<Team>({ ...INITIAL_TEAM });
  
  const [p1SkipUsed, setP1SkipUsed] = useState(false);
  const [p2SkipUsed, setP2SkipUsed] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCharacter, setPendingCharacter] = useState<CharacterData | null>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  // --- IMAGE URL FIXER ---
  const getImageUrl = (path: string | null) => {
      if (!path || path === "null" || path === "undefined") return "/images/spin/Captain.png";
      if (path.startsWith("http")) return path;
      return `http://localhost:5000${path}`;
  };

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCharacters();
        if (data && data.length > 0) setCharacterList(data);
      } catch (err) { console.error(err); }
    }
    loadData();
  }, []);

  const handleSpinClick = () => {
    if (isSpinning) return;
    const currentTeam = currentTurn === 'p1' ? p1Team : p2Team;
    const isFull = Object.values(currentTeam).every(slot => slot !== null);
    if (isFull) {
        addLog(`⚠️ ${currentTurn === 'p1' ? 'Player 1' : 'Player 2'} team is full!`);
        return;
    }
    setIsSpinning(true);
  };

  const onSpinFinish = (character: CharacterData) => {
    setIsSpinning(false);
    setPendingCharacter(character);
    setIsModalOpen(true);
  };

  const handleRoleConfirm = (role: string) => {
    if (!pendingCharacter) return;
    const cleanBounty = pendingCharacter.bounty ? pendingCharacter.bounty.replace(/,/g, '') : "0";
    const rawBounty = parseInt(cleanBounty, 10) || 0;
    const powerLevel = Math.floor(Math.sqrt(rawBounty) / 10);

    if (currentTurn === 'p1') {
        setP1Team(prev => ({ ...prev, [role]: pendingCharacter }));
        setP1Power(prev => prev + powerLevel);
        setCurrentTurn('p2'); 
    } else {
        setP2Team(prev => ({ ...prev, [role]: pendingCharacter }));
        setP2Power(prev => prev + powerLevel);
        setCurrentTurn('p1'); 
    }
    setIsModalOpen(false);
    setPendingCharacter(null);
  };

  // --- SKIP LOGIC (NO TURN SWITCH) ---
  const handleSkip = () => {
    if (!pendingCharacter) return;
    
    if (currentTurn === 'p1') {
        setP1SkipUsed(true); 
        addLog(`🚫 Player 1 SKIPPED ${pendingCharacter.name}. Spin again!`);
    } else {
        setP2SkipUsed(true);
        addLog(`🚫 Player 2 SKIPPED ${pendingCharacter.name}. Spin again!`);
    }
    setIsModalOpen(false);
    setPendingCharacter(null);
  };

  const handleReset = () => {
    setP1Power(0); setP2Power(0);
    setP1Team({ ...INITIAL_TEAM }); setP2Team({ ...INITIAL_TEAM });
    setP1SkipUsed(false); setP2SkipUsed(false);
    setCurrentTurn('p1');
    setLogs(["🔄 Battle reset!"]);
  };

  const renderSlot = (role: string, team: Team) => {
    const character = team[role];
    const frameMap: { [key: string]: string } = {
        "Captain": "/images/spin/Captain-frame.png",
        "Vice-Captain": "/images/spin/vice-captain-frame.png",
        "Tank": "/images/spin/Tank-frame.png",
        "Support": "/images/spin/support-frame.png",
        "Healer": "/images/spin/healer-frame.png"
    };
    
    return (
        <div key={role} className="flex flex-col items-center shrink-0">
            <div className="relative shrink-0" style={{ width: '170px', height: '215px' }}>
                 {character && (
                   <div className="absolute inset-0 z-0">
                     <Image 
                        src={getImageUrl(character.image)} 
                        alt={character.name} 
                        fill 
                        style={{ objectFit: "cover" }} 
                        className="rounded-lg" 
                        unoptimized={true} 
                     />
                   </div>
                 )}
                 <div className="absolute inset-0 z-10 pointer-events-none">
                    <Image src={frameMap[role] || "/images/spin/Captain-frame.png"} alt={`${role} Frame`} fill style={{ objectFit: "contain" }} />
                 </div>
            </div>
            <div className="bg-black border border-[#c89b3c]/30 mt-1 flex items-center justify-center py-1 shrink-0 w-[170px]">
                <span className="text-[#c89b3c] text-[12px] font-bold uppercase tracking-wider truncate px-1">
                    {character ? character.name : role.toUpperCase()}
                </span>
            </div>
        </div>
    );
  };

  const renderTeamSlots = (team: Team, side: 'left' | 'right') => {
    const gridPart = (
        <div className="flex flex-col gap-4"> 
            <div className="flex gap-4">
                {renderSlot("Captain", team)}
                {renderSlot("Vice-Captain", team)}
            </div>
            <div className="flex gap-4">
                {renderSlot("Tank", team)}
                {renderSlot("Support", team)} 
            </div>
        </div>
    );
    const isolatedPart = (
        <div className="h-full flex items-center justify-center px-2">
            {renderSlot("Healer", team)}
        </div>
    );
    return (
      <div className={`flex items-center gap-6 mt-4 justify-center ${side === 'right' ? 'flex-row-reverse' : ''}`}>
         {gridPart} {isolatedPart}
      </div>
    );
  };

  return (
    <main className="spin-battle-page hide-global-nav" style={{ minHeight: '100vh', height: 'auto', overflowY: 'auto', paddingBottom: '150px', display: 'block' }}>
      <style dangerouslySetInnerHTML={{__html: `nav, header { display: none !important; } html, body { overflow-y: auto !important; }`}} />
      
      <RoleSelectionModal 
        isOpen={isModalOpen}
        character={pendingCharacter}
        takenRoles={currentTurn === 'p1' ? Object.keys(p1Team).filter(k => p1Team[k] !== null) : Object.keys(p2Team).filter(k => p2Team[k] !== null)}
        canSkip={currentTurn === 'p1' ? !p1SkipUsed : !p2SkipUsed}
        onConfirm={handleRoleConfirm}
        onSkip={handleSkip}
      />

      <WelcomeModal />

      <div className="battle-header-bar">
        <Link href="/" className="header-link">HOME</Link>
        <button onClick={handleReset} className="header-link">RESET BATTLE</button>
      </div>

      <div className="title-section">
          <h1 className="spin-battle-title-styled">SPIN BATTLE</h1>
      </div>

      <div className="battle-arena-grid">
        <div className={`player-column p1-column ${currentTurn === 'p1' ? 'active' : 'inactive'}`}>
            <div className="player-panel-image relative" style={{ width: '300px', height: '400px' }}>
              <Image src="/images/spin/Player-1-panel.png" alt="Player 1" fill style={{objectFit: "contain"}} />
            </div>
            {renderTeamSlots(p1Team, 'left')}
        </div>

        {/* WHEEL COLUMN */}
        <div className="wheel-section flex flex-col items-center justify-center pt-2">
            <SpinWheel 
                onSpinFinish={onSpinFinish} 
                onSpinClick={handleSpinClick} 
                isSpinning={isSpinning} 
                characterList={characterList} 
            />
            
            <div className="mt-24 text-[#c89b3c] font-bold uppercase tracking-widest bg-black/50 px-4 py-1 rounded-full border border-[#c89b3c]/30">
                Turn: {currentTurn === 'p1' ? "Player 1" : "Player 2"}
            </div>
        </div>

        <div className={`player-column p2-column ${currentTurn === 'p2' ? 'active' : 'inactive'}`}>
            <div className="player-panel-image relative" style={{ width: '300px', height: '400px' }}>
              <Image src="/images/spin/Player-2-panel.png" alt="Player 2" fill style={{objectFit: "contain"}} />
            </div>
            {renderTeamSlots(p2Team, 'right')}
        </div>
      </div>
      <div className="bottom-area-wrapper">
         <BattleInfoPanel logs={logs} p1Power={p1Power} p2Power={p2Power} />
      </div>
    </main>
  );
}