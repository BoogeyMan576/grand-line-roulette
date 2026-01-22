import Link from "next/link";

export default function About() {
  return (
    <section className="about-page">
      <div className="about-container">
        {/* ABOUT GRAND LINE ROULETTE */}
        <h1 className="about-title">About Grand Line Roulette</h1>
        <p className="about-tagline">
          A strategy-driven spin battle inspired by the world of One Piece.
        </p>

        <div className="about-divider"></div>

        {/* WHO WE ARE */}
        <h2>Who We Are</h2>
        <p>
          We are fans, builders, and strategists who love competitive games and the
          vast universe of One Piece. Grand Line Roulette blends luck with strategy
          to create meaningful battles.
        </p>

        <div className="about-divider"></div>

        {/* WHY THIS GAME EXISTS */}
        <h2>Why This Game Exists</h2>
        <p>
          Most spin games stop at randomness. We wanted to go further —
          a system where decisions matter, roles define outcomes, and
          every battle feels earned.
        </p>

        <div className="about-divider"></div>

        {/* WHAT MAKES IT DIFFERENT */}
        <h2>What Makes It Different</h2>

        <div className="about-features">
          <div className="feature">
            <h4>Strategy First</h4>
            <p>Winning depends on how you build and assign your crew.</p>
          </div>

          <div className="feature">
            <h4>Role-Based Combat</h4>
            <p>Captain, Tank, Support — each role changes the outcome.</p>
          </div>

          <div className="feature">
            <h4>One Piece Inspired</h4>
            <p>Every system is designed around the spirit of the Grand Line.</p>
          </div>
        </div>
      </div>
      
      <div className="about-divider"></div>

      <section className="about-cta">
        <h2>Ready to Set Sail?</h2>
        <p>
          Build your crew, assign roles, and prove your strategy on the Grand Line.
        </p>

        <div className="about-cta-actions">
          <Link href="/" className="cta-btn primary">
            Back to Home
          </Link>
          <Link href="/spin-battle" className="cta-btn secondary">
            Start Spin Battle
          </Link>
        </div>
      </section>
    </section>
  );
}