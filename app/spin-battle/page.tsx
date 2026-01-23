"use client";
import { useState, useEffect } from "react"; // Added useEffect
import Image from "next/image";
import Link from "next/link";
import WelcomeModal from "../components/WelcomeModal";
import BattleInfoPanel from "../components/BattleInfoPanel";
import SpinWheel from "../components/SpinWheel";
import RoleSelectionModal from "../components/RoleSelectionModal";
import { CharacterData } from "../../utils/onePieceApi";

// DEFINE THE TEAM STRUCTURE
type Team = {
  [key: string]: CharacterData | null;
};

const INITIAL_TEAM: Team = {
    "Captain": null,
    "Vice-Captain": null,
    "Tank": null,
    "Support": null,
    "Healer": null
};

export default function SpinBattle() {
  // --- SCROLL UNLOCKER (THE FIX) ---
  useEffect(() => {
    // This forces the browser to remove any "overflow: hidden" locks
    document.body.style.overflow = "auto";
    document.body.style.overflowY = "auto";
    document.body.style.height = "auto";
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.height = "auto";
    document.documentElement.style.overflowY = "auto";
  }, []);

  // --- GAME STATE ---
  const [p1Power, setP1Power] = useState(1500);
  const [p2Power, setP2Power] = useState(2300);
  const [logs, setLogs] = useState<string[]>(["Welcome to the Grand Line! Battle has commenced."]);
  
  const [currentTurn, setCurrentTurn] = useState<'p1' | 'p2'>('p1');
  const [isSpinning, setIsSpinning] = useState(false);
  
  const [p1Team, setP1Team] = useState<Team>({ ...INITIAL_TEAM });
  const [p2Team, setP2Team] = useState<Team>({ ...INITIAL_TEAM });
  
  const [p1SkipUsed, setP1SkipUsed] = useState(false);
  const [p2SkipUsed, setP2SkipUsed] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCharacter, setPendingCharacter] = useState<CharacterData | null>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  // 1. CLICK SPIN
  const handleSpinClick = () => {
    if (isSpinning) return;
    const currentTeam = currentTurn === 'p1' ? p1Team : p2Team;
    const isFull = Object.values(currentTeam).every(slot => slot !== null);
    if (isFull) {
        addLog(`${currentTurn === 'p1' ? 'Player 1' : 'Player 2'} team is full!`);
        return;
    }
    setIsSpinning(true);
    addLog(`${currentTurn === 'p1' ? 'Player 1' : 'Player 2'} is spinning...`);
  };

  // 2. SPIN FINISHED -> OPEN MODAL
  const onSpinFinish = (character: CharacterData) => {
    setIsSpinning(false);
    setPendingCharacter(character);
    setIsModalOpen(true);
  };

  // 3. CONFIRM ROLE
  const handleRoleConfirm = (role: string) => {
    if (!pendingCharacter) return;

    if (currentTurn === 'p1') {
        setP1Team(prev => ({ ...prev, [role]: pendingCharacter }));
        const powerGain = calculatePower(pendingCharacter.bounty);
        setP1Power(prev => prev + powerGain);
        addLog(`P1 assigned ${pendingCharacter.name} as ${role} (+${powerGain} Power)`);
        setCurrentTurn('p2'); 
    } else {
        setP2Team(prev => ({ ...prev, [role]: pendingCharacter }));
        const powerGain = calculatePower(pendingCharacter.bounty);
        setP2Power(prev => prev + powerGain);
        addLog(`P2 assigned ${pendingCharacter.name} as ${role} (+${powerGain} Power)`);
        setCurrentTurn('p1'); 
    }

    setIsModalOpen(false);
    setPendingCharacter(null);
  };

  // 4. SKIP TURN
  const handleSkip = () => {
    if (!pendingCharacter) return;
    if (currentTurn === 'p1') {
        setP1SkipUsed(true);
        addLog(`Player 1 skipped ${pendingCharacter.name}! Re-rolling...`);
    } else {
        setP2SkipUsed(true);
        addLog(`Player 2 skipped ${pendingCharacter.name}! Re-rolling...`);
    }
    setIsModalOpen(false);
    setPendingCharacter(null);
  };

  const calculatePower = (bountyStr: string) => {
      const val = parseInt(bountyStr.replace(/,/g, '') || "0", 10);
      return Math.floor(val / 100000) + 100;
  };

  const handleReset = () => {
    setP1Power(1500); setP2Power(2300);
    setP1Team({ ...INITIAL_TEAM }); setP2Team({ ...INITIAL_TEAM });
    setP1SkipUsed(false); setP2SkipUsed(false);
    setCurrentTurn('p1');
    setLogs(["Battle has been reset."]);
  };

  // --- RENDER HELPERS ---
  const renderSlot = (role: string, team: Team) => {
    const character = team[role];
    return (
        <div key={role} className="crew-slot-wrapper flex flex-col items-center">
            {/* Using inline styles to guarantee visibility */}
            <div className="crew-slot relative" style={{ width: '130px', height: '165px' }}>
                 <Image 
                    src={character ? character.image : "/images/spin/Captain.png"} 
                    alt={role} 
                    fill 
                    style={{ objectFit: character ? "cover" : "contain" }} 
                    className={character ? "rounded-md" : ""}
                 />
                 <div className="absolute bottom-0 w-full bg-black/70 text-[#c89b3c] text-[10px] text-center py-1 uppercase font-bold tracking-wider">
                    {role}
                 </div>
            </div>
        </div>
    );
  };

  const renderTeamSlots = (team: Team, side: 'left' | 'right') => {
    const gridPart = (
        <div className="crew-grid-2x2 flex flex-col gap-2">
            <div className="flex gap-2">
                {renderSlot("Tank", team)}
                {renderSlot("Support", team)}
            </div>
            <div className="flex gap-2">
                {renderSlot("Healer", team)}
                {renderSlot("Vice-Captain", team)}
            </div>
        </div>
    );
    const captainPart = (
        <div className="h-full flex items-center justify-center">
            {renderSlot("Captain", team)}
        </div>
    );
    return (
      <div className={`crew-slots-container ${side} flex items-center gap-4 mt-4`}>
        {side === 'left' ? <>{gridPart}{captainPart}</> : <>{captainPart}{gridPart}</>}
      </div>
    );
  };

  return (
    // FIX: Main container forced to allow scrolling
    <main className="spin-battle-page hide-global-nav" style={{ minHeight: '100vh', height: 'auto', overflowY: 'auto', paddingBottom: '100px', display: 'block' }}>
      
      {/* GLOBAL CSS OVERRIDE */}
      <style dangerouslySetInnerHTML={{__html: `
        nav, header, .navbar, .nav-bar { display: none !important; }
        html, body { overflow-y: auto !important; height: auto !important; min-height: 100vh; }
      `}} />
      
      <RoleSelectionModal 
        isOpen={isModalOpen}
        character={pendingCharacter}
        takenRoles={currentTurn === 'p1' 
            ? Object.keys(p1Team).filter(k => p1Team[k] !== null)
            : Object.keys(p2Team).filter(k => p2Team[k] !== null)
        }
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
          <p className="spin-battle-subtitle-styled">Draft your crew. Fill all 5 roles.</p>
      </div>

      <div className="battle-arena-grid">
        {/* P1 */}
        <div className={`player-column p1-column ${currentTurn === 'p1' ? 'active' : 'inactive'}`}>
            {/* Inline styles for guaranteed image size */}
            <div className="player-panel-image relative" style={{ width: '300px', height: '400px' }}>
              <Image src="/images/spin/Player-1-panel.png" alt="Player 1" fill style={{objectFit: "contain"}} />
            </div>
            {renderTeamSlots(p1Team, 'left')}
        </div>

        {/* WHEEL */}
        <div className="wheel-section">
            <SpinWheel onSpinFinish={onSpinFinish} isSpinning={isSpinning} />
            
            <button 
                onClick={handleSpinClick} 
                className={`spin-image-btn ${isSpinning ? 'disabled' : ''}`}
                disabled={isSpinning}
            >
              <Image src="/images/spin/spin-button.png" alt="Spin" width={220} height={80} />
            </button>

            <div className="vs-emblem-container">
              <Image src="/images/spin/vs.png" alt="VS" width={100} height={60} />
            </div>
            
            <div className="mt-4 text-[#c89b3c] text-sm uppercase tracking-widest font-bold">
                Turn: {currentTurn === 'p1' ? "Player 1" : "Player 2"}
            </div>
        </div>

        {/* P2 */}
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