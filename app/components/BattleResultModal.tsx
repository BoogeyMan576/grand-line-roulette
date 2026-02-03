"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { CharacterData } from "../../types/Character";
import styles from "../Css/BattleResultModal.module.css";
import { calculatePower } from "../../utils/gameLogic"; 

interface TeamMap {
  [role: string]: CharacterData | null;
}

interface BattleResultModalProps {
  isOpen: boolean;
  player1Team: TeamMap;
  player2Team: TeamMap;
  onRestart: () => void;
}

export default function BattleResultModal({
  isOpen,
  player1Team,
  player2Team,
  onRestart,
}: BattleResultModalProps) {

  // --- 1. CALCULATE SCORES (Always at top) ---
  const p1Score = useMemo(() => {
    if (!player1Team) return 0;
    // calculatePower now safely handles 'null', so we don't need to filter
    return Object.values(player1Team).reduce((total, char) => total + calculatePower(char), 0);
  }, [player1Team]);

  const p2Score = useMemo(() => {
    if (!player2Team) return 0;
    return Object.values(player2Team).reduce((total, char) => total + calculatePower(char), 0);
  }, [player2Team]);

  // --- 2. RETURN NULL IF CLOSED ---
  if (!isOpen) return null;

  // --- 3. DETERMINE WINNER TEXT & STYLES ---
  let winnerText = "⚔️ IT'S A DRAW! ⚔️";
  let winnerSubText = "Both crews are equally matched!";
  let p1Class = styles.scoreDisplay;
  let p2Class = styles.scoreDisplay;

  if (p1Score > p2Score) {
    winnerText = "👑 PLAYER 1 IS THE PIRATE KING!";
    winnerSubText = "Player 1's crew dominates the Grand Line!";
    p1Class = `${styles.scoreDisplay} ${styles.winnerHighlight}`; // Green
    p2Class = `${styles.scoreDisplay} ${styles.loserHighlight}`;  // Red
  } else if (p2Score > p1Score) {
    winnerText = "🏆 VICTORY FOR PLAYER 2!";
    winnerSubText = "Player 2 has crushed their rivals!";
    p2Class = `${styles.scoreDisplay} ${styles.winnerHighlight}`; // Green
    p1Class = `${styles.scoreDisplay} ${styles.loserHighlight}`;  // Red
  }

  const getImageUrl = (path: string | undefined) => {
    if (!path) return "/images/spin/Captain.png";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  const renderTeamGrid = (team: TeamMap) => {
    if (!team) return null;
    return Object.values(team).map((char, index) => (
      <div key={index} className={styles.miniCard}>
        {char ? (
           <Image
             src={getImageUrl(char.image)}
             alt={char.name}
             fill
             className={styles.miniImg}
           />
        ) : (
           <div className={styles.emptySlot} />
        )}
      </div>
    ));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.board}>
        
        {/* --- WINNER TITLE --- */}
        <div className={styles.headerSection}>
            <h1 className={styles.title}>{winnerText}</h1>
            <p className={styles.subTitle}>{winnerSubText}</p>
        </div>

        <div className={styles.teamsContainer}>
          
          {/* PLAYER 1 COLUMN */}
          <div className={styles.teamColumn}>
            <div className={styles.teamTitle}>Player 1 Crew</div>
            <div className={styles.charGrid}>
              {renderTeamGrid(player1Team)}
            </div>
            {/* Show Calculated Power */}
            <div className={p1Class}>
                <span>Power Level</span>
                <strong>{p1Score.toLocaleString()}</strong>
            </div>
          </div>

          <div className={styles.vsDivider}>VS</div>

          {/* PLAYER 2 COLUMN */}
          <div className={styles.teamColumn}>
            <div className={styles.teamTitle}>Player 2 Crew</div>
            <div className={styles.charGrid}>
              {renderTeamGrid(player2Team)}
            </div>
            {/* Show Calculated Power */}
            <div className={p2Class}>
                <span>Power Level</span>
                <strong>{p2Score.toLocaleString()}</strong>
            </div>
          </div>

        </div>

        <button className={styles.restartBtn} onClick={onRestart}>
          START NEW BATTLE
        </button>

      </div>
    </div>
  );
}