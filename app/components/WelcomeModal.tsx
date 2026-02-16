"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!!document.fullscreenElement) setIsOpen(true);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="overlay-main">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        .overlay-main {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.96);
          display: flex; justify-content: center; z-index: 99999;
          backdrop-filter: blur(10px); overflow-y: auto;
        }

        .poster-card {
          background-color: #f2e2b0;
          background-image: radial-gradient(#f2e2b0 70%, #e0cda7 100%);
          font-family: 'Georgia', serif; color: #1a110a;
          display: flex; flex-direction: column; position: relative;
          box-shadow: 0 0 50px rgba(0,0,0,0.9); height: fit-content;
        }

        .w-title { font-family: 'Bebas Neue', sans-serif; font-weight: 900; line-height: 1; margin: 0; text-align: center; }
        .red-txt { font-weight: 900; text-transform: uppercase; color: #d32f2f; text-align: center; }
        
        .poster-divider { 
          background-color: #3e2723 !important; 
          width: 100% !important; 
          display: block !important;
          opacity: 1 !important;
        }

        .poster-content { list-style: none; padding: 0; margin: 0; }
        .bullet-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
        .bullet-icon { color: #d32f2f; font-weight: bold; }

        .system-note {
          background: rgba(62, 39, 35, 0.05);
          border-left: 3px solid #3e2723;
          padding: 10px;
          margin: 15px 0;
          font-style: italic;
          opacity: 0.8;
          line-height: 1.4;
        }

        /* --- BUTTON CONTAINER BASE --- */
        .btn-container {
          display: flex;
          gap: 10px;
          width: 100%;
        }

        .btn-battle { background: #1a110a; color: #f2e2b0; border: none; font-weight: bold; cursor: pointer; font-family: 'Bebas Neue', sans-serif; text-align: center; }
        .btn-rules { border: 1px solid #1a110a; text-decoration: none; color: #1a110a; text-align: center; font-weight: bold; opacity: 0.7; display: flex; align-items: center; justify-content: center; }

        /* --- MOBILE (Max-width 950px) --- */
        @media (max-width: 950px) {
          .overlay-main { align-items: flex-start !important; padding: 20px 10px !important; }
          .poster-card { width: 90% !important; max-width: 590px !important; padding: 15px !important; border: 4px double #3e2723 !important; }
          .w-title { font-size: 2.8rem !important; letter-spacing: 2px !important; }
          .red-txt { font-size: 0.6rem !important; }
          .poster-divider { height: 2px !important; margin: 10px 0 !important; }
          .poster-content { font-size: 0.85rem !important; }
          .system-note { font-size: 0.7rem !important; }
          
          /* Side by Side Buttons on Mobile */
          .btn-container { flex-direction: row !important; }
          .btn-battle { flex: 1; padding: 12px !important; font-size: 1.2rem !important; box-shadow: 0 4px 0 #d32f2f !important; }
          .btn-rules { flex: 1; padding: 12px !important; font-size: 1rem !important; height: 55px;}
        }

        /* --- DESKTOP (Min-width 951px) --- */
        @media (min-width: 951px) {
          .overlay-main { align-items: center !important; padding: 40px !important; }
          .poster-card { width: 690px !important; min-height: 700px !important; padding: 40px !important; border: 10px double #3e2723 !important; }
          .w-title { font-size: 8rem !important; letter-spacing: 12px !important; }
          .red-txt { font-size: 1.2rem !important; margin-top: 10px; }
          .poster-divider { height: 4px !important; margin: 25px 0 !important; } 
          .poster-content { font-size: 1.2rem !important; }
          .system-note { font-size: 1rem !important; margin: 25px 0 !important; }
          
          /* Stacked Buttons on Desktop */
          .btn-container { flex-direction: column !important; }
          .btn-battle { padding: 10px !important; height: 80px !important; font-size: 2.8rem !important; letter-spacing: 3px !important; box-shadow: 0 10px 0 #d32f2f !important; margin-bottom: 5px !important;;}
          .btn-rules { padding: 12px !important; height: 60px !important; font-size: 1.1rem !important; border-width: 2px !important; }
        }
      ` }} />

      <div className="poster-card">
        <div style={{ textAlign: 'center', fontSize: '0.6rem', fontWeight: 'bold' }}>☠︎ MARINES ☠︎</div>
        <h1 className="w-title">WANTED</h1>
        
        <div className="poster-divider"></div>
        
        <div className="red-txt">grand-line-roulette</div>

        <ul className="poster-content">
          <li className="bullet-item">
            <span className="bullet-icon">☠︎</span>
            <div><strong>RECRUIT:</strong> Spin to get characters and assign roles to build your crew.</div>
          </li>
          
          <li className="bullet-item">
            <span className="bullet-icon">⚔️</span>
            <div><strong>ARENA:</strong> Match origins for a massive <strong>+1500</strong> boost.</div>
          </li>
          
          <li className="bullet-item">
            <span className="bullet-icon">🔥</span>
            <div><strong>CONQUER:</strong> Use Haki to win the battle and rule the sea.</div>
          </li>
        </ul>

        <div className="system-note">
          <strong>Note:</strong> Character data is sourced online. To ensure fair gameplay, some high-tier characters may have adjusted power levels within our balanced system.
        </div>

        {/* --- BUTTON CONTAINER --- */}
        <div className="btn-container">
          <button onClick={() => setIsOpen(false)} className="btn-battle">JOIN BATTLE</button>
          <Link href="/rules" className="btn-rules">RULES</Link>
        </div>
        
        <div style={{ position: 'absolute', top: '5px', right: '8px', opacity: 0.1, fontSize: '2rem' }}>⚓</div>
      </div>
    </div>
  );
}