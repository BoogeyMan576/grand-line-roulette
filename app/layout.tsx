import type { Metadata } from "next";
import { Inter, Cinzel, Cinzel_Decorative, Poppins } from "next/font/google"; 
import "./globals.css"; 
import "./main.css";
import "./Css/about.css";
import "./responsive.css";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar"; 
import ScrollToTop from "./components/ScrollToTop"; 

// 1. IMPORT YOUR NEW METADATA
import { gameMetadata } from "./metadata";
import JsonLd from "./components/JsonLd";

// 2. CONFIGURE FONTS
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

// 3. EXPORT THE METADATA (Replaces your old simple metadata)
export const metadata: Metadata = gameMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%", overflowY: "scroll" }}>
      <head>
        <JsonLd />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      
      <body 
        className={`${inter.className} ${cinzel.variable} ${cinzelDecorative.variable} ${poppins.variable}`}
        style={{ 
           minHeight: "100vh", 
           margin: 0, 
           padding: 0, 
           overflowY: "auto", 
           overflowX: "hidden", 
           backgroundColor: "#050505",
           color: "white"
        }}
      >
        <Navbar />
        
        {children}

        <ScrollToTop />
        
        <footer className="premium-footer">
            <div className="footer-container">
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
                
                <div className="footer-links">
                    <Link href="/">Home</Link>
                    <Link href="/about">About Us</Link>
                    <Link href="/spin-battle">Spin Battle</Link>
                    <Link href="/rules">Rules</Link>
                    <Link href="/blog">Blog</Link>
                </div>
                
                <div className="footer-bottom">
                    © 2026 Grand Line Roulette. All rights reserved.
                </div>
            </div>
        </footer>
      </body>
    </html>
  );
}