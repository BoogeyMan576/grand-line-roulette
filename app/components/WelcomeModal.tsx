"use client";
import { useEffect, useState } from "react";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");
    if (!hasSeenIntro) {
      const timer = setTimeout(() => setIsOpen(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenIntro", "true");
  };

  if (!isOpen) return null;

  // --- INLINE STYLES (These will override any broken CSS file) ---
  const overlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 99999, backdropFilter: 'blur(5px)'
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: '#f4e4bc', width: '90%', maxWidth: '500px',
    padding: '40px', textAlign: 'center',
    border: '4px solid #5a3e2b', boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)',
    position: 'relative', fontFamily: 'Courier New, Courier, monospace',
    color: '#3e2723'
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, margin: '0 0 10px 0', borderBottom: '3px solid #3e2723' }}>WANTED</h2>
        <p style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '30px', textTransform: 'uppercase' }}>
            BRAVE CAPTAINS FOR THE GRAND LINE
        </p>

        <div style={{ textAlign: 'left', marginBottom: '30px' }}>
             <p><strong>1. SPIN THE WHEEL</strong><br/>Recruit a random pirate.</p>
             <p style={{ marginTop: '10px' }}><strong>2. ASSIGN ROLES</strong><br/>Choose Captain, Tank, etc.</p>
             <p style={{ marginTop: '10px' }}><strong>3. BATTLE</strong><br/>Compare bounties to win.</p>
        </div>

        <button onClick={handleClose} style={{
            backgroundColor: '#3e2723', color: '#f4e4bc', border: '2px solid #3e2723',
            padding: '15px 30px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', width: '100%'
        }}>
          I ACCEPT THE CHALLENGE
        </button>
      </div>
    </div>
  );
}