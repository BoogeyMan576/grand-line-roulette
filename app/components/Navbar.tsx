"use client";
import { useState } from "react"; // Removed 'useEffect' to fix the error
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();

  // Logic: Check if we are on About or Rules page for "Light Mode" styles
  const isLightMode = pathname === "/about" || pathname === "/rules";

  // Helper to check if link is active
  const checkActive = (path: string) => pathname === path ? "active" : "";

  return (
    <header>
      {/* Add 'light-mode' class if on about/rules, 'menu-open' if mobile menu is active */}
      <nav className={`nav-bar ${isLightMode ? "light-mode" : ""} ${isActive ? "menu-open" : ""}`}>
        
        {/* LEFT: Logo (Centered on Mobile) */}
        <section className="left">
          <Link href="/">
            <Image 
              className="Logo"
              src="/images/one-piece-logo-2.png" 
              alt="Logo" 
              width={100} 
              height={50} 
              priority
              style={{ width: "100px", height: "auto" }}
            />
          </Link>
        </section>

        {/* CENTER: Menu Links */}
        <section className={`center ${isActive ? "active" : ""}`} id="navMenu">
          <ul>
            <li>
                <Link href="/" className={checkActive("/")} onClick={() => setIsActive(false)}>
                    Home
                </Link>
            </li>
            <li>
                <Link href="/about" className={checkActive("/about")} onClick={() => setIsActive(false)}>
                    About Us
                </Link>
            </li>
            <li>
                <Link href="/spin-battle" className={checkActive("/spin-battle")} onClick={() => setIsActive(false)}>
                    Spin Battle
                </Link>
            </li>
            <li>
                <Link href="/rules" className={checkActive("/rules")} onClick={() => setIsActive(false)}>
                    Rules
                </Link>
            </li>
            <li>
                <Link href="/blog" className={checkActive("/blog")} onClick={() => setIsActive(false)}>
                    Blog
                </Link>
            </li>
          </ul>
        </section>

        {/* RIGHT: Container for Icons + Hamburger */}
        <section className="right">
          {/* Social Icons (Absolute Left on Mobile) */}
          <div className="right-social-icons">
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>

          {/* Hamburger Icon (Absolute Right on Mobile) */}
          <div 
            className={`hamburger ${isActive ? "active" : ""}`} 
            onClick={() => setIsActive(!isActive)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </section>
      </nav>
    </header>
  );
}