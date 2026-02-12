"use client";
import { useEffect, useState } from "react"; // Now we will use this!
import Link from "next/link";
import Image from "next/image";


export default function Home() {
  
  // 1. STATE: Track which world card is selected
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);

  // 2. EFFECT: Handle Scroll Animations (Fixes Black Screen)
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 } 
    );

    reveals.forEach((el) => observer.observe(el));
  }, []);

  // 3. FUNCTION: Handle Card Clicks
  const handleWorldClick = (worldName: string) => {
    // If clicking the same one, deselect it. Otherwise, select new one.
    if (selectedWorld === worldName) {
        setSelectedWorld(null);
    } else {
        setSelectedWorld(worldName);
        localStorage.setItem('selectedWorld', worldName);
    }
  };

  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-image"></div>
          
          <div className="hero-content">
            <div className="hero-content-img">
              {/* Start Button */}
              <Link href="/spin-battle" className="left-button" id="start-spin-btn">
                <Image 
                  src="/images/button-2.png" 
                  alt="Start Button" 
                  width={340} 
                  height={100} 
                  style={{ height: 'auto' }}
                />
                <span className="btn-text start-spin">START SPIN BATTLE</span>
              </Link>

              {/* Center Logo */}
              <div className="hero-center-one-piece-logo">
                 <Image 
                   src="/images/one-piece-logo-3.png" 
                   alt="Center Logo" 
                   width={480} 
                   height={300}
                   priority 
                   style={{ height: 'auto' }}
                 />
              </div>

              {/* How It Works Button */}
              <a href="#how-it-works" className="right-button" id="how-it-works-btn">
                <Image 
                  src="/images/button-01.png" 
                  alt="How it works button" 
                  width={340} 
                  height={100}
                  style={{ height: 'auto' }}
                />
                <span className="btn-text how-it-works">HOW IT WORKS</span>
              </a>
            </div>

            <div className="hero-info-box">
              <h2>What is Grand Line Roulette?</h2>
              <p>
                Grand Line Roulette is a strategy-based spin game inspired by the world of One Piece.
                Each player spins the wheel to receive a random character, assigns them a role, and builds a
                crew. When both players finish, the crews are compared to decide the strongest pirate team.
              </p>
            </div>
          </div>
        </section>
      </main>

      <section className="content-wrapper">
        <div className="section-separator"></div>

        {/* About Section */}
        <section id="about-one-piece" className="reveal fade-up">
          <div className="about-content">
            <h2 className="about-tital">About One Piece</h2>
            <div className="image-divider-about"></div>
            <h3 className="about-sub">What is One Piece?</h3>
            <div className="about-content-p">
              <p className="about-content-p-1">
                Embark on an epic adventure with Monkey D. Luffy and his crew as they journey across the seas in
                search of the legendary treasure known as the One Piece. This series is a tale of bravery,
                adventure, camaraderie, and the relentless pursuit of dreams.
              </p>
              <p className="about-content-p-2">
                Join the Straw Hat Pirates as they battle powerful enemies, explore mysterious islands, and
                uncover the secrets of a vast world filled with pirates, marines, ancient legends, and mythical
                creatures.
              </p>
            </div>
          </div>
          <div className="about-image-contener">
            <Image 
              className="about-image" 
              src="/images/image-1-.jpg" 
              alt="one-piece-image" 
              width={570} 
              height={400}
              style={{ height: 'auto' }}
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-game-works reveal fade-up" id="how-it-works">
          <div className="ornament-divider">
            <Image 
              src="/images/divider - Copy.png" 
              alt="divider ornament" 
              width={400} 
              height={42} 
              style={{ width: 'auto', height: '42px' }}
            />
          </div>
          <h3>How the Game Works</h3>
          <div className="image-divider"></div>
          
          <div className="how-steps">
            <div className="how-card reveal fade-up" style={{ "--delay": "0s" } as React.CSSProperties}>
              <span className="step-number">1</span>
              <h4>Spin the Wheel</h4>
              <p>Spin the roulette to receive a random One Piece character.</p>
            </div>
            <div className="how-card reveal fade-up" style={{ "--delay": "0.1s" } as React.CSSProperties}>
              <span className="step-number">2</span>
              <h4>Assign Roles</h4>
              <p>Choose Captain, Tank, Healer, Support, or Vice Captain.</p>
            </div>
            <div className="how-card reveal fade-up" style={{ "--delay": "0.2s" } as React.CSSProperties}>
              <span className="step-number">3</span>
              <h4>Battle Begins</h4>
              <p>Both players complete their crews and prepare for battle.</p>
            </div>
            <div className="how-card reveal fade-up" style={{ "--delay": "0.3s" } as React.CSSProperties}>
              <span className="step-number">4</span>
              <h4>Determine Winner</h4>
              <p>The strongest crew earns victory on the Grand Line.</p>
            </div>
          </div>
        </section>

        {/* World Section (NOW WITH CLICK LOGIC) */}
        <section className="world-of-one-piece reveal fade-up">
          <div className="image-divider"></div>
          <h3>The World of One Piece</h3>

          <div className="world-list">
            {/* Grand Line */}
            <div 
                className={`world-card reveal fade-up ${selectedWorld === 'grand-line' ? 'selected' : ''} ${selectedWorld && selectedWorld !== 'grand-line' ? 'dimmed' : ''}`}
                style={{ "--delay": "0s" } as React.CSSProperties}
                onClick={() => handleWorldClick('grand-line')}
            >
              <Image src="/images/grand-line.png" alt="Grand Line" width={265} height={400} style={{ height: 'auto' }} />
              <div className="nameplate-text">Grand Line</div>
            </div>

            {/* Marine Base */}
            <div 
                className={`world-card reveal fade-up ${selectedWorld === 'marine-base' ? 'selected' : ''} ${selectedWorld && selectedWorld !== 'marine-base' ? 'dimmed' : ''}`}
                style={{ "--delay": "0.1s" } as React.CSSProperties}
                onClick={() => handleWorldClick('marine-base')}
            >
              <Image src="/images/marine-base.png" alt="Marine Base" width={265} height={400} style={{ height: 'auto' }} />
              <div className="nameplate-text">Marine Base</div>
            </div>

            {/* Sky Island */}
            <div 
                className={`world-card reveal fade-up ${selectedWorld === 'sky-island' ? 'selected' : ''} ${selectedWorld && selectedWorld !== 'sky-island' ? 'dimmed' : ''}`}
                style={{ "--delay": "0.2s" } as React.CSSProperties}
                onClick={() => handleWorldClick('sky-island')}
            >
              <Image src="/images/sky-island.png" alt="Sky Island" width={265} height={400} style={{ height: 'auto' }} />
              <div className="nameplate-text">Sky Island</div>
            </div>

            {/* Fish-Man Island */}
            <div 
                className={`world-card reveal fade-up ${selectedWorld === 'fishman-island' ? 'selected' : ''} ${selectedWorld && selectedWorld !== 'fishman-island' ? 'dimmed' : ''}`}
                style={{ "--delay": "0.3s" } as React.CSSProperties}
                onClick={() => handleWorldClick('fishman-island')}
            >
              <Image src="/images/fishman-island.png" alt="Fish-Man Island" width={265} height={400} style={{ height: 'auto' }} />
              <div className="nameplate-text">Fish-Man Island</div>
            </div>
          </div>
        </section>

        {/* Why Play Section */}
        <section className="why-play reveal fade-up">
          <div className="image-divider-why-play"></div>

          <h3>Why Play Grand Line Roulette?</h3>
          <p className="why-sub">
            More than a spin — it’s a test of strategy, luck, and pirate instincts.
          </p>

          <div className="why-grid">
            <div className="why-card">
              <h4>Strategy Over Luck</h4>
              <p>Every spin gives a character, but victory depends on how you assign roles and build your crew intelligently.</p>
            </div>
            <div className="why-card">
              <h4>Endless Replay Value</h4>
              <p>No two battles are ever the same. Different characters, different roles, different outcomes every time.</p>
            </div>
            <div className="why-card">
              <h4>Head-to-Head Battles</h4>
              <p>Challenge friends in true pirate fashion. Captain vs Captain, crew vs crew — only the strongest survives.</p>
            </div>
            <div className="why-card">
              <h4>True One Piece Fantasy</h4>
              <p>Inspired by the Grand Line, crews, and legendary roles — this feels like a One Piece game, not a random generator.</p>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}