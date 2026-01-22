"use client";
import { useEffect, useState } from "react";

// 1. CONSTANT DATA (Defined outside the component)
// This holds all the buff information so we don't need 'state' for it.
const WORLD_BUFFS: Record<string, { title: string; desc: string }> = {
  "marine-base": {
    title: "⚓ Marine Justice",
    desc: "All Marine characters receive a +10% Strength Bonus.",
  },
  "sky-island": {
    title: "☁️ Skypiea Altitude",
    desc: "Sky Island characters gain +10% Speed & Evasion.",
  },
  "fishman-island": {
    title: "🌊 Deep Sea Advantage",
    desc: "Fish-Man characters gain +10% Defense in water terrain.",
  },
  "grand-line": {
    title: "🏴‍☠️ Pirate Era",
    desc: "Standard Rules. No terrain advantages.",
  },
};

export default function SpinBattle() {
  // 2. SINGLE STATE
  // We only track the 'world'. We do NOT track 'buff' in state.
  const [world, setWorld] = useState("grand-line");

  // 3. DERIVED STATE (Calculated automatically)
  // Whenever 'world' changes, 'currentBuff' updates instantly. No setBuff needed!
  const currentBuff = WORLD_BUFFS[world] || WORLD_BUFFS["grand-line"];

  // 4. EFFECT (Only sets world, fixes the cascading error)
  useEffect(() => {
  const savedWorld = localStorage.getItem("selectedWorld");
  if (savedWorld && savedWorld !== world) {
    setWorld(savedWorld);
  }
}, [world]);


  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a120b",
        color: "#fff",
        paddingTop: "120px",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            fontFamily: "var(--font-cinzel-decorative)",
            fontSize: "48px",
            color: "#ffb347",
          }}
        >
          Battle Location: {world.replace("-", " ").toUpperCase()}
        </h1>
      </div>

      {/* BUFF CARD */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.05)",
          padding: "30px",
          borderRadius: "15px",
          border: "2px solid #c89b3c",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#c89b3c",
            fontFamily: "var(--font-cinzel)",
            marginBottom: "15px",
          }}
        >
          Active World Buff
        </h2>

        <h3 style={{ fontSize: "28px", marginBottom: "10px" }}>
          {currentBuff.title}
        </h3>
        <p style={{ fontSize: "16px", color: "#e6d3b0" }}>{currentBuff.desc}</p>
      </div>

      {/* Placeholder Wheel */}
      <div style={{ textAlign: "center", marginTop: "80px", opacity: 0.5 }}>
        <h2>[ Spin Wheel Component Goes Here ]</h2>
      </div>
    </main>
  );
}