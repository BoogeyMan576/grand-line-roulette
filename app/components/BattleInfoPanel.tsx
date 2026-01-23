"use client";
import React, { useRef, useEffect } from "react";

// Types for props
interface BattleInfoProps {
  logs: string[];
  p1Power: number;
  p2Power: number;
}

export default function BattleInfoPanel({ logs, p1Power, p2Power }: BattleInfoProps) {
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="battle-info-panel">
      
      {/* Player 1 Stats */}
      <div className="stats-box p1-stats">
        <h4>PLAYER 1 POWER</h4>
        <div className="power-value">{p1Power.toLocaleString()}</div>
        <div className="power-bar">
            <div className="bar-fill p1" style={{ width: `${Math.min(p1Power / 100, 100)}%` }}></div>
        </div>
      </div>

      {/* Battle Log (Center) */}
      <div className="battle-log-container">
        <h5 className="log-title">BATTLE LOG</h5>
        <div className="log-scroll-area" ref={logContainerRef}>
          {logs.length === 0 ? (
            <p className="log-empty">Waiting for the first spin...</p>
          ) : (
            logs.map((log, index) => (
              <p key={index} className="log-entry">
                <span className="log-arrow">➤</span> {log}
              </p>
            ))
          )}
        </div>
      </div>

      {/* Player 2 Stats */}
      <div className="stats-box p2-stats">
        <h4>PLAYER 2 POWER</h4>
        <div className="power-value">{p2Power.toLocaleString()}</div>
        <div className="power-bar">
            <div className="bar-fill p2" style={{ width: `${Math.min(p2Power / 100, 100)}%` }}></div>
        </div>
      </div>

    </div>
  );
}