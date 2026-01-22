import type { Metadata } from "next";
import { Inter, Cinzel, Cinzel_Decorative, Poppins } from "next/font/google"; 
import Image from "next/image"; 
import Link from "next/link"; 
import "./globals.css"; 
import "./main.css";
import "./Css/about.css"
import "./responsive.css";
import Navbar from "./components/Navbar"; 
import ScrollToTop from "./components/ScrollToTop"; 

// 1. Configure Fonts
const inter = Inter({ subsets: ["latin"] });

const cinzel = Cinzel({ 
  subsets: ["latin"], 
  weight: ["600", "700"],
  variable: "--font-cinzel",
});

const cinzelDecorative = Cinzel_Decorative({ 
  subsets: ["latin"], 
  weight: ["400", "700", "900"],
  variable: "--font-cinzel-decorative",
});

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Grand Line Roulette",
  description: "One Piece Spin Battle Game",
  icons: {
    icon: '/path/to/my-favicon.png', // Relative path from public directory
    apple: '/path/to/my-apple-icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      
      <body className={`${inter.className} ${cinzel.variable} ${cinzelDecorative.variable} ${poppins.variable}`}>
        
        <Navbar />
        
        {children}

        <ScrollToTop />
        
        {/* FOOTER */}
        {/* FOOTER */}
        <footer className="premium-footer">
            <div className="footer-container">
                
                {/* 1. BRAND & TAGLINE (Centered) */}
                <div className="footer-brand">
                    <Image 
                      src="/images/one-piece-logo-3.png" 
                      alt="Grand Line Roulette" 
                      width={180} 
                      height={90} 
                      style={{ width: '180px', height: 'auto' }}
                    />
                    <p className="footer-tagline">Strategy. Luck. The Will of Pirates.</p>
                </div>
                
                {/* 2. LINKS (Centered Row) */}
                <div className="footer-links">
                    <Link href="/">Home</Link>
                    <Link href="/about">About Us</Link>
                    <Link href="/spin-battle">Spin Battle</Link>
                    <Link href="/rules">Rules</Link>
                    <Link href="/blog">Blog</Link>
                </div>
                
                {/* 3. SOCIAL (Centered Row) */}
                <div className="footer-social">
                    <a href="#"><i className="fab fa-discord"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                </div>

                {/* 4. COPYRIGHT BOTTOM */}
                <div className="footer-bottom">
                    © 2026 Grand Line Roulette. All rights reserved.
                </div>
            </div>
        </footer>

      </body>
    </html>
  );
}