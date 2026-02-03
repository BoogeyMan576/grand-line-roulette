"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CharacterData } from "../../types/Character";
import styles from "../Css/RoleSelectionModal.module.css"; 

// Keep constant data OUTSIDE the component to prevent re-creation
const ROLES = [
  { id: "Captain", img: "/images/Role-Selcetion/Captain-button.png" },
  { id: "Vice-Captain", img: "/images/Role-Selcetion/Vice-captain-button.png" },
  { id: "Tank", img: "/images/Role-Selcetion/Tank-buttonpng.png" },
  { id: "Support", img: "/images/Role-Selcetion/Support-button.png" },
  { id: "Healer", img: "/images/Role-Selcetion/Healer-button.png" },
];

interface RoleSelectionModalProps {
  isOpen: boolean;
  character: CharacterData | null;
  takenRoles: string[];
  onConfirm: (role: string) => void;
  onSkip: () => void;
  canSkip: boolean;
}

export default function RoleSelectionModal({
  isOpen,
  character,
  takenRoles,
  onConfirm,
  onSkip,
  canSkip,
}: RoleSelectionModalProps) {
  
  const [timeLeft, setTimeLeft] = useState(3000);

  // --- FIX: RESET LOGIC (Pattern: "Adjusting State during Render") ---
  // We track the previous props to know when to reset.
  const [prevProps, setPrevProps] = useState({ 
      isOpen: isOpen, 
      charName: character?.name 
  });

  // Check if props changed since the last render
  if (isOpen !== prevProps.isOpen || character?.name !== prevProps.charName) {
      // Update our tracker
      setPrevProps({ isOpen, charName: character?.name });
      
      // If opening or changing character, RESET TIMER immediately
      if (isOpen) {
          setTimeLeft(30);
      }
  }
  // ------------------------------------------------------------------

  // --- TIMER COUNTDOWN EFFECT ---
  useEffect(() => {
    // If closed or no character, do nothing
    if (!isOpen || !character) return;

    // A: Check if time is up
    if (timeLeft === 0) {
        const availableRole = ROLES.find(r => !takenRoles.includes(r.id));
        if (availableRole) {
            onConfirm(availableRole.id);
        } else {
            onSkip();
        }
        return; 
    }

    // B: Countdown Logic
    const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isOpen, character, takenRoles, onConfirm, onSkip]); 


  if (!isOpen || !character) return null;

  const getImageUrl = (path: string | null | undefined) => {
    if (!path || path === "null") return "/images/spin/Captain.png"; 
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.masterContainer}>
        
        <Image 
            src="/images/Role-Selcetion/background.png" 
            alt="Background"
            width={1300} 
            height={750} 
            className={styles.bgImage}
            priority
        />

        <div className={styles.overlayLayer}>
            
            <div className={styles.timerDisplay}>
                {timeLeft}s
            </div>

            <div className={styles.unifiedRow}>

                {/* LEFT SIDE: CHARACTER FRAME */}
                <div className={styles.characterFrameContainer}>
                     <Image 
                        src="/images/Role-Selcetion/character-frame.png" 
                        alt="Frame"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className={styles.frameImage}
                        style={{ width: '500px', height: '100%' }} 
                     />
                     
                     <div className={styles.innerPlaceholder}>
                          <Image 
                              src={getImageUrl(character.image)} 
                              alt={character.name} 
                              fill 
                              className={styles.characterImg} 
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                     </div>

                     <div className={styles.nameTag}>
                        <span className={styles.nameText}>{character.name}</span>
                     </div>
                </div>

                {/* RIGHT SIDE: BUTTONS */}
                <div className={styles.buttonsContainer}>
                    <div className={styles.buttonsGrid}>
                        {ROLES.slice(0, 4).map((role) => {
                            const isTaken = takenRoles.includes(role.id);
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => !isTaken && onConfirm(role.id)}
                                    disabled={isTaken}
                                    className={styles.roleButton}
                                >
                                    <Image src={role.img} alt={role.id} fill className={styles.btnImage} />
                                </button>
                            );
                        })}
                    </div>

                    <div className={styles.healerContainer}>
                         {(() => {
                            const healer = ROLES[4];
                            const isTaken = takenRoles.includes(healer.id);
                            return (
                                <button
                                    onClick={() => !isTaken && onConfirm(healer.id)}
                                    disabled={isTaken}
                                    className={styles.roleButton}
                                >
                                    <Image src={healer.img} alt="Healer" fill className={styles.btnImage} />
                                </button>
                            );
                         })()}
                    </div>

                    <button onClick={onSkip} disabled={!canSkip} className={styles.skipButton}>
                        <Image src="/images/Role-Selcetion/skip.png" alt="Skip" fill className={styles.btnImage} />
                    </button>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}