"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import WelcomeModal from "../components/WelcomeModal";
import BattleInfoPanel from "../components/BattleInfoPanel";
import SpinWheel from "../components/SpinWheel";
import RoleSelectionModal from "../components/RoleSelectionModal";
import BattleResultModal from "../components/BattleResultModal"; 
import { fetchCharacters } from "../../utils/onePieceApi";
import { CharacterData } from "../../types/Character";
import { calculatePower } from "../../utils/gameLogic";
import { useBattleScale } from './useBattleScale'; // Import the hook


// ✅ CSS IMPORT
import "../Css/SpinBattle.css"; 

type Team = { [key: string]: CharacterData | null };

const INITIAL_TEAM: Team = {
  Captain: null,
  "Vice-Captain": null,
  Tank: null,
  Support: null,
  Healer: null,
};

export default function SpinBattle() {
  const [hasStarted, setHasStarted] = useState(false);
  const [worldName, setWorldName] = useState("GRAND LINE");
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ✅ STATE: Orientation & Menu
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [characterList, setCharacterList] = useState<CharacterData[]>([]);
  const [p1Power, setP1Power] = useState(0);
  const [p2Power, setP2Power] = useState(0);
  const [logs, setLogs] = useState<string[]>(["Welcome to the Grand Line! Spin to recruit."]);
  const [currentTurn, setCurrentTurn] = useState<"p1" | "p2">("p1");
  const [isSpinning, setIsSpinning] = useState(false);
  const [p1Team, setP1Team] = useState<Team>({ ...INITIAL_TEAM });
  const [p2Team, setP2Team] = useState<Team>({ ...INITIAL_TEAM });
  const [p1SkipUsed, setP1SkipUsed] = useState(false);
  const [p2SkipUsed, setP2SkipUsed] = useState(false);
  const [pendingCharacter, setPendingCharacter] = useState<CharacterData | null>(null);
  useBattleScale();

  // ✅ LOGIC: Detect Portrait Mode
  useEffect(() => {
    const checkOrientation = () => {
      if (window.innerWidth <= 1024 && window.innerHeight > window.innerWidth) {
        setIsPortrait(true);
      } else {
        setIsPortrait(false);
        setIsMenuOpen(false); 
      }
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    if (typeof document !== 'undefined' && document.fullscreenElement) {
        setTimeout(() => setHasStarted(true), 0);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
       const saved = localStorage.getItem('selectedWorld');
       if (saved) setTimeout(() => setWorldName(saved.replace(/-/g, ' ').toUpperCase()), 0);
    }
  }, []);

  useEffect(() => {
    const p1Full = Object.values(p1Team).every((slot) => slot !== null);
    const p2Full = Object.values(p2Team).every((slot) => slot !== null);
    if (p1Full && p2Full) setTimeout(() => setIsBattleOver(true), 1000); 
  }, [p1Team, p2Team]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCharacters();
        if (data && data.length > 0) setCharacterList(data);
      } catch (err) {
        console.error("❌ Failed to connect to Backend:", err);
      }
    }
    loadData();
  }, []);

  const handleStartInteraction = async () => {
    try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    } catch (err) { console.error("Full screen error:", err); }
    setHasStarted(true);
  };

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  const getImageUrl = (path: string | null) => {
    if (!path || path === "null" || path === "undefined") return "/images/spin/Captain.png";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  const handleSpinClick = () => {
    if (isSpinning) return;
    const currentTeam = currentTurn === "p1" ? p1Team : p2Team;
    if (Object.values(currentTeam).every((slot) => slot !== null)) {
      addLog(`⚠️ ${currentTurn === "p1" ? "Player 1" : "Player 2"} team is full!`);
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
    const powerLevel = calculatePower(pendingCharacter);
    const playerName = currentTurn === "p1" ? "Player 1" : "Player 2";
    addLog(`✅ ${playerName} recruited ${pendingCharacter.name} as ${role}!`);

    if (currentTurn === "p1") {
      setP1Team((prev) => ({ ...prev, [role]: pendingCharacter }));
      setP1Power((prev) => prev + powerLevel);
      setCurrentTurn("p2");
    } else {
      setP2Team((prev) => ({ ...prev, [role]: pendingCharacter }));
      setP2Power((prev) => prev + powerLevel);
      setCurrentTurn("p1");
    }
    setIsModalOpen(false);
    setPendingCharacter(null);
  };

  const handleSkip = () => {
    if (!pendingCharacter) return;
    if (currentTurn === "p1") {
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
    setP1Power(0);
    setP2Power(0);
    setP1Team({ ...INITIAL_TEAM });
    setP2Team({ ...INITIAL_TEAM });
    setP1SkipUsed(false);
    setP2SkipUsed(false);
    setCurrentTurn("p1");
    setLogs(["🔄 Battle reset!"]);
    setIsBattleOver(false); 
    setIsMenuOpen(false);
  };

  const renderSlot = (role: string, team: Team) => {
    const character = team[role];
    const emptyFrameMap: { [key: string]: string } = {
      Captain: "/images/spin/Captain-frame.png",
      "Vice-Captain": "/images/spin/vice-captain-frame.png",
      Tank: "/images/spin/Tank-frame.png",
      Support: "/images/spin/support-frame.png",
      Healer: "/images/spin/healer-frame.png",
    };
    const filledFrameMap: { [key: string]: string } = {
      Captain: "/images/after-spin/Captain-frame.png",
      "Vice-Captain": "/images/after-spin/vice-captain-frame.png",
      Tank: "/images/after-spin/Tank-frame.png",
      Support: "/images/after-spin/support-frame.png",
      Healer: "/images/after-spin/healer-frame.png",
    };
    const currentFrame = character ? filledFrameMap[role] : emptyFrameMap[role];
    const imageSettings = { width: "125px", height: "125px", top: "26px", left: "10px" };

    return (
      <div key={role} className="flex flex-col items-center shrink-0">
        <div className="relative shrink-0" style={{ width: "145px", height: "185px" }}>
          {character && <div className="absolute z-0 bg-black rounded-md" style={imageSettings}></div>}
          {character && (
            <div className="absolute z-1 overflow-hidden rounded-md" style={imageSettings}>
              <Image src={getImageUrl(character.image)} alt={character.name} fill style={{ objectFit: "cover", objectPosition: "top" }} unoptimized={true} />
            </div>
          )}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Image src={currentFrame} alt={`${role} Frame`} fill style={{ objectFit: "contain" }} />
          </div>
        </div>
        <div className="bg-black border border-[#c89b3c]/30 mt-1 flex items-center justify-center py-1 shrink-0 w-36 h-5.5">
          <span className="text-[#c89b3c] text-[11px] font-bold uppercase tracking-wider truncate px-1">
            {character ? character.name : role.toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  const renderTeamSlots = (team: Team, side: "left" | "right") => {
    const gridPart = (
      <div className="flex flex-col gap-4 grid-part-container">
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
      <div className="h-full flex items-center justify-center px-1">
        {renderSlot("Healer", team)}
      </div>
    );

    const shiftClass = side === "left" ? "ml-12" : "mr-12";
    return (
      <div className={`team-wrapper flex items-center gap-4 mt-4 justify-center ${side === "right" ? "flex-row-reverse" : ""} ${shiftClass}`}>
        {gridPart} {isolatedPart}
      </div>
    );
  };

  const availableCharacters = useMemo(() => {
    const takenIds = new Set([
      ...Object.values(p1Team).map((c) => c?.id),
      ...Object.values(p2Team).map((c) => c?.id),
    ].filter((id): id is number => id !== undefined && id !== null));
    return characterList.filter((char) => !takenIds.has(char.id));
  }, [characterList, p1Team, p2Team]);

  return (
    <>
      {isPortrait && (
        <div className="rotate-device-overlay">
           <button className="rotate-hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
             <svg width="30" height="30" viewBox="0 0 24 24" stroke="#c89b3c" strokeWidth="2" strokeLinecap="round">
               <line x1="3" y1="12" x2="21" y2="12"></line>
               <line x1="3" y1="6" x2="21" y2="6"></line>
               <line x1="3" y1="18" x2="21" y2="18"></line>
             </svg>
           </button>
           {isMenuOpen && (
             <div className="rotate-mobile-menu">
               <Link href="/" className="rotate-menu-link">HOME</Link>
               <button onClick={handleReset} className="rotate-menu-link">RESET BATTLE</button>
             </div>
           )}
           <svg className="rotate-icon" viewBox="0 0 24 24">
             <path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32zm-6.25-.77c-.59-.59-1.54-.59-2.12 0L1.75 8.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12L10.23 1.75zm4.6 19.44L2.81 9.17l6.36-6.36 12.02 12.02-6.36 6.36zm-7.31.29C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z"/>
           </svg>
           <p className="rotate-text">Please Rotate Your Device</p>
        </div>
      )}

      {!hasStarted && !isPortrait && (
        <div className="fixed inset-0 z-9999 bg-black flex flex-col items-center justify-center">
            <p className="text-white mb-8 text-xl tracking-wider font-light opacity-80">FOR THE BEST EXPERIENCE</p>
            <button onClick={handleStartInteraction} className="px-8 py-4 bg-[#c89b3c] text-black font-black text-xl rounded border-4 border-white hover:scale-105 transition-transform">
                CLICK TO START (FULL SCREEN)
            </button>
        </div>
      )}

      <main className="spin-battle-page hide-global-nav">
        <RoleSelectionModal
          isOpen={isModalOpen}
          character={pendingCharacter}
          takenRoles={currentTurn === "p1" ? Object.keys(p1Team).filter((k) => p1Team[k] !== null) : Object.keys(p2Team).filter((k) => p2Team[k] !== null)}
          canSkip={currentTurn === "p1" ? !p1SkipUsed : !p2SkipUsed}
          onConfirm={handleRoleConfirm}
          onSkip={handleSkip}
        />

        <WelcomeModal />

        {!isPortrait && (
          <div className="battle-header-bar">
            <div className="desktop-nav">
              <Link href="/" className="header-link">HOME</Link>
              <button onClick={handleReset} className="header-link">RESET BATTLE</button>
            </div>
          </div>
        )}

        <div className="title-section">
          <div style={{ position: "relative", width: "500px", height: "120px" }}>
            <Image src="/images/spin/spin-battle.png" alt="Spin Battle" fill style={{ objectFit: "contain" }} priority />
          </div>
        </div>

        <div className="battle-arena-grid">
          <div className={`player-column p1-column ${currentTurn === "p1" ? "active" : "inactive"}`}>
            <div className="player-panel-image">
              <Image src="/images/spin/Player-1-panel.png" alt="Player 1" fill style={{ objectFit: "contain" }} />
              <div className="overlay-world-name">
                <p className="text-[#c89b3c] font-bold text-lg tracking-widest font-serif" style={{ textShadow: "1px 1px 0 #000" }}>{worldName}</p>
              </div>
              <div className="overlay-power-score">
                 <p className="power-text">{p1Power.toLocaleString()}</p>
                 <p className="text-white/60 text-xs uppercase tracking-widest">Power Level</p>
              </div>
            </div>
            {renderTeamSlots(p1Team, "left")}
          </div>

          <div className="wheel-section">
            <SpinWheel
              onSpinFinish={onSpinFinish}
              onSpinClick={handleSpinClick}
              isSpinning={isSpinning}
              characterList={availableCharacters} 
            />
            <div className="mt-24 text-[#c89b3c] player-turn font-bold uppercase tracking-widest bg-black/50 px-4 py-1 rounded-full border border-[#c89b3c]/30">
              Turn: {currentTurn === "p1" ? "Player 1" : "Player 2"}
            </div>
          </div>
          
          <div className={`player-column p2-column ${currentTurn === "p2" ? "active" : "inactive"}`}>
            <div className="player-panel-image">
              <Image src="/images/spin/Player-2-panel.png" alt="Player 2" fill style={{ objectFit: "contain" }} />
              <div className="overlay-world-name">
                <p className="text-[#c89b3c] font-bold text-lg tracking-widest font-serif" style={{ textShadow: "1px 1px 0 #000" }}>{worldName}</p>
              </div>
              <div className="overlay-power-score">
                 <p className="power-text">{p2Power.toLocaleString()}</p>
                 <p className="text-white/60 text-xs uppercase tracking-widest">Power Level</p>
              </div>
            </div>
            {renderTeamSlots(p2Team, "right")}
          </div>
        </div>
        
        <div className="bottom-area-wrapper">
          <BattleInfoPanel logs={logs} p1Power={p1Power} p2Power={p2Power} />
        </div>

        <BattleResultModal 
          isOpen={isBattleOver}
          player1Team={p1Team as Record<string, CharacterData>} 
          player2Team={p2Team as Record<string, CharacterData>}
          onRestart={handleReset}
        />

        {/* ✅ FINAL PLACEMENT: Hamburger button and dropdown menu outside header */}
        {!isPortrait && (
          <>
            <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg width="30" height="30" viewBox="0 0 24 24" stroke="#c89b3c" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            {isMenuOpen && (
              <div className="mobile-menu-dropdown">
                <Link href="/" className="header-link mobile-link">HOME</Link>
                <button onClick={handleReset} className="header-link mobile-link">RESET BATTLE</button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}