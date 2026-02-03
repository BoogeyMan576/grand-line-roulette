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

type Team = { [key: string]: CharacterData | null };

const INITIAL_TEAM: Team = {
  Captain: null,
  "Vice-Captain": null,
  Tank: null,
  Support: null,
  Healer: null,
};

export default function SpinBattle() {
  // --- 1. STATE VARIABLES ---
  
  // Full Screen & World State
  const [hasStarted, setHasStarted] = useState(false);
  const [worldName, setWorldName] = useState("GRAND LINE");

  // Modal State
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Game Data State
  const [characterList, setCharacterList] = useState<CharacterData[]>([]);
  const [p1Power, setP1Power] = useState(0);
  const [p2Power, setP2Power] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    "Welcome to the Grand Line! Spin to recruit.",
  ]);

  // Turn & Logic State
  const [currentTurn, setCurrentTurn] = useState<"p1" | "p2">("p1");
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Teams
  const [p1Team, setP1Team] = useState<Team>({ ...INITIAL_TEAM });
  const [p2Team, setP2Team] = useState<Team>({ ...INITIAL_TEAM });
  
  const [p1SkipUsed, setP1SkipUsed] = useState(false);
  const [p2SkipUsed, setP2SkipUsed] = useState(false);
  
  const [pendingCharacter, setPendingCharacter] = useState<CharacterData | null>(null);

  // --- 2. EFFECTS ---

  // Full Screen Check
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    if (typeof document !== 'undefined' && document.fullscreenElement) {
        setTimeout(() => {
            setHasStarted(true);
        }, 0);
    }
  }, []);

  // Load World Name from LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
       const saved = localStorage.getItem('selectedWorld');
       if (saved) {
         // FIX: Wrap in setTimeout to avoid "Synchronous setState" error
         setTimeout(() => {
            setWorldName(saved.replace(/-/g, ' ').toUpperCase());
         }, 0);
       }
    }
  }, []);

  // Game Over Watcher
  useEffect(() => {
    const p1Full = Object.values(p1Team).every((slot) => slot !== null);
    const p2Full = Object.values(p2Team).every((slot) => slot !== null);

    if (p1Full && p2Full) {
      setTimeout(() => {
        setIsBattleOver(true);
      }, 1000); 
    }
  }, [p1Team, p2Team]);

  // --- 3. HELPER FUNCTIONS ---

  const handleStartInteraction = async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        }
    } catch (err) {
        console.error("Full screen error:", err);
    }
    setHasStarted(true);
  };

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  const getImageUrl = (path: string | null) => {
    if (!path || path === "null" || path === "undefined")
      return "/images/spin/Captain.png";

    if (path.startsWith("http")) return path;

    return `http://localhost:5000${path}`;
  };

  // Load Data
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCharacters();

        if (data && data.length > 0) {
          setCharacterList(data);
          console.log("✅ Loaded " + data.length + " characters from Backend");
        } else {
          console.error(
            "❌ Backend connected, but returned NO characters. Check characters.json!",
          );
        }
      } catch (err) {
        console.error("❌ Failed to connect to Backend:", err);
      }
    }

    loadData();
  }, []);

  const handleSpinClick = () => {
    if (isSpinning) return;

    const currentTeam = currentTurn === "p1" ? p1Team : p2Team;
    const isFull = Object.values(currentTeam).every((slot) => slot !== null);
    if (isFull) {
      addLog(
        `⚠️ ${currentTurn === "p1" ? "Player 1" : "Player 2"} team is full!`,
      );
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

    // Use the NEW formula so scores match everywhere
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
  };

  const renderSlot = (role: string, team: Team) => {
    const character = team[role];

    // 1. FRAMES FOR EMPTY SLOTS (Brown/Dark Backgrounds)
    const emptyFrameMap: { [key: string]: string } = {
      Captain: "/images/spin/Captain-frame.png",
      "Vice-Captain": "/images/spin/vice-captain-frame.png",
      Tank: "/images/spin/Tank-frame.png",
      Support: "/images/spin/support-frame.png",
      Healer: "/images/spin/healer-frame.png",
    };

    // 2. FRAMES FOR FILLED SLOTS (Transparent frames in 'after-spin')
    const filledFrameMap: { [key: string]: string } = {
      Captain: "/images/after-spin/Captain-frame.png",
      "Vice-Captain": "/images/after-spin/vice-captain-frame.png",
      Tank: "/images/after-spin/Tank-frame.png",
      Support: "/images/after-spin/support-frame.png",
      Healer: "/images/after-spin/healer-frame.png",
    };

    // 3. DECIDE WHICH FRAME TO SHOW
   const currentFrame = character ? filledFrameMap[role] : emptyFrameMap[role];

    // --- 3. SETTINGS: CONTROL SIZE AND POSITION HERE ---
    const imageSettings = {
      width: "125px",   // Set the exact Width
      height: "125px",  // Set the exact Height
      top: "26px",      // Move Down (increase to move lower)
      left: "10px",     // Move Right (increase to move right)
    };

    return (
      <div key={role} className="flex flex-col items-center shrink-0">
        <div
          className="relative shrink-0"
          style={{ width: "145px", height: "185px" }}
        >
          
          {/* --- BLACK BACKGROUND LAYER (Controlled by imageSettings) --- */}
          {character && (
            <div 
              className="absolute z-0 bg-black rounded-md"
              style={imageSettings}
            ></div>
          )}

          {/* --- CHARACTER IMAGE LAYER (Controlled by imageSettings) --- */}
          {character && (
            <div 
              className="absolute z-1 overflow-hidden rounded-md"
              style={imageSettings}
            >
              <Image
                src={getImageUrl(character.image)}
                alt={character.name}
                fill
                style={{ objectFit: "cover", objectPosition: "top" }} 
                unoptimized={true}
              />
            </div>
          )}

          {/* --- FRAME LAYER (Sits on top) --- */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Image
              src={currentFrame}
              alt={`${role} Frame`}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Nameplate */}
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
      <div className="h-full flex items-center justify-center px-1">
        {renderSlot("Healer", team)}
      </div>
    );

    const shiftClass = side === "left" ? "ml-12" : "mr-12";
    return (
      <div
        className={`
          flex items-center gap-4 mt-4 justify-center
          ${side === "right" ? "flex-row-reverse" : ""}
          ${shiftClass}
        `}
      >
        {gridPart} {isolatedPart}
      </div>
    );
  };

  // Prevent Duplicates
  const availableCharacters = useMemo(() => {
    const takenIds = new Set([
      ...Object.values(p1Team).map((c) => c?.id),
      ...Object.values(p2Team).map((c) => c?.id),
    ].filter((id): id is number => id !== undefined && id !== null));

    return characterList.filter((char) => !takenIds.has(char.id));
  }, [characterList, p1Team, p2Team]);


  return (
    <>
      {/* Full Screen Overlay */}
      {!hasStarted && (
        <div className="fixed inset-0 z-9999 bg-black flex flex-col items-center justify-center">
            <p className="text-white mb-8 text-xl tracking-wider font-light opacity-80">
                FOR THE BEST EXPERIENCE
            </p>
            <button 
                onClick={handleStartInteraction}
                className="px-8 py-4 bg-[#c89b3c] text-black font-black text-xl rounded border-4 border-white hover:scale-105 transition-transform">
                CLICK TO START (FULL SCREEN)
            </button>
        </div>
      )}

      <main
        className="spin-battle-page hide-global-nav"
        style={{
          minHeight: "100vh",
          height: "auto",
          overflowY: "auto",
          paddingBottom: "150px",
          display: "block",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `nav, header { display: none !important; } html, body { overflow-y: auto !important; }`,
          }}
        />

        {/* IMPORT RYE FONT FOR OVERLAYS */}
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Rye&display=swap');
        `}} />

        <RoleSelectionModal
          isOpen={isModalOpen}
          character={pendingCharacter}
          takenRoles={
            currentTurn === "p1"
              ? Object.keys(p1Team).filter((k) => p1Team[k] !== null)
              : Object.keys(p2Team).filter((k) => p2Team[k] !== null)
          }
          canSkip={currentTurn === "p1" ? !p1SkipUsed : !p2SkipUsed}
          onConfirm={handleRoleConfirm}
          onSkip={handleSkip}
        />

        <WelcomeModal />

        <div className="battle-header-bar">
          <Link href="/" className="header-link">
            HOME
          </Link>

          <button onClick={handleReset} className="header-link">
            RESET BATTLE
          </button>
        </div>

        <div
          className="title-section"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "-100px",
            marginBottom: "20px",
          }}
        >
          <div style={{ position: "relative", width: "500px", height: "120px" }}>
            <Image
              src="/images/spin/spin-battle.png"
              alt="Spin Battle"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        <div className="battle-arena-grid">
          
          {/* PLAYER 1 COLUMN */}
          <div
            className={`player-column p1-column ${currentTurn === "p1" ? "active" : "inactive"}`}
          >
            <div
              className="player-panel-image relative"
              style={{ width: "300px", height: "400px" }}
            >
              <Image
                src="/images/spin/Player-1-panel.png"
                alt="Player 1"
                fill
                style={{ objectFit: "contain" }}
              />

              {/* WORLD NAME OVERLAY */}
              <div className="absolute top-[65px] left-0 w-full text-center px-8">
                <p className="text-[#c89b3c] font-bold text-lg tracking-widest font-serif" 
                   style={{ textShadow: "1px 1px 0 #000" }}>
                   {worldName}
                </p>
              </div>

              {/* POWER SCORE OVERLAY */}
              <div className="absolute bottom-[100px] left-0 w-full text-center">
                 <p className="text-[#ffd700] font-black text-4xl drop-shadow-md" 
                    style={{ fontFamily: "'Rye', serif" }}>
                    {p1Power.toLocaleString()}
                 </p>
                 <p className="text-white/60 text-xs uppercase tracking-widest">Power Level</p>
              </div>
            </div>
            {renderTeamSlots(p1Team, "left")}
          </div>

          <div className="wheel-section flex flex-col items-center justify-center pt-2">
            <SpinWheel
              onSpinFinish={onSpinFinish}
              onSpinClick={handleSpinClick}
              isSpinning={isSpinning}
              characterList={availableCharacters} 
            />

            <div className="mt-24 text-[#c89b3c] font-bold uppercase tracking-widest bg-black/50 px-4 py-1 rounded-full border border-[#c89b3c]/30">
              Turn: {currentTurn === "p1" ? "Player 1" : "Player 2"}
            </div>
          </div>
          
          {/* PLAYER 2 COLUMN */}
          <div
            className={`player-column p2-column ${currentTurn === "p2" ? "active" : "inactive"}`}
          >
            <div
              className="player-panel-image relative"
              style={{ width: "300px", height: "400px" }}
            >
              <Image
                src="/images/spin/Player-2-panel.png"
                alt="Player 2"
                fill
                style={{ objectFit: "contain" }}
              />

              {/* WORLD NAME OVERLAY */}
              <div className="absolute top-[65px] left-0 w-full text-center px-8">
                <p className="text-[#c89b3c] font-bold text-lg tracking-widest font-serif"
                   style={{ textShadow: "1px 1px 0 #000" }}>
                   {worldName}
                </p>
              </div>

              {/* POWER SCORE OVERLAY */}
              <div className="absolute bottom-[100px] left-0 w-full text-center">
                 <p className="text-[#ffd700] font-black text-4xl drop-shadow-md"
                    style={{ fontFamily: "'Rye', serif" }}>
                    {p2Power.toLocaleString()}
                 </p>
                 <p className="text-white/60 text-xs uppercase tracking-widest">Power Level</p>
              </div>
            </div>

            {renderTeamSlots(p2Team, "right")}
          </div>
        </div>
        
        <div className="bottom-area-wrapper">
          <BattleInfoPanel logs={logs} p1Power={p1Power} p2Power={p2Power} />
        </div>

        {/* RESULT MODAL */}
        <BattleResultModal 
          isOpen={isBattleOver}
          player1Team={p1Team as Record<string, CharacterData>} 
          player2Team={p2Team as Record<string, CharacterData>}
          onRestart={handleReset}
        />

      </main>
    </>
  );
}