import Link from "next/link";

export default function Rules() {
  return (
    <section className="about-page">
      <div className="about-container">
        {/* PAGE TITLE */}
        <h1 className="about-title">Game Rules</h1>
        <p className="about-tagline">
          Learn how battles are decided on the Grand Line.
        </p>

        <div className="about-divider"></div>

        {/* RULE 1 */}
        <h2>Spin the Wheel</h2>
        <p>
          Each player spins the wheel to receive random One Piece characters.
          Characters cannot be rerolled. Every spin matters.
        </p>

        <div className="about-divider"></div>

        {/* RULE 2 */}
        <h2>Assign Roles</h2>
        <p>
          Each character must be assigned a role such as Captain, Tank, Healer,
          DPS, or Support. The same character can perform very differently
          depending on the role chosen.
        </p>

        <div className="about-divider"></div>

        {/* RULE 3 */}
        <h2>Choose an Island</h2>
        <p>
          Battles take place on different islands like Grand Line, Marine Base,
          Sky Island, or Fish-Man Island. Each island provides unique bonuses
          that can turn the tide of battle.
        </p>

        <div className="about-divider"></div>

        {/* RULE 4 */}
        <h2>Battle Resolution</h2>
        <p>
          Battles are resolved automatically using character power,
          role synergy, and island bonuses. There is no luck during combat —
          preparation decides victory.
        </p>

        <div className="about-divider"></div>

        {/* RULE 5 */}
        <h2>Winning the Battle</h2>
        <p>
          The crew with the strongest overall synergy wins.
          Power alone is not enough — smart role assignments
          and island choice determine the final outcome.
        </p>
      </div>

      <div className="about-divider"></div>

      {/* CTA */}
      <section className="about-cta">
        <h2>Ready to Test the Rules?</h2>
        <p>Strategy is everything on the Grand Line.</p>

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