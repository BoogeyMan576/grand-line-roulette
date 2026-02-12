// app/metadata.ts
import type { Metadata } from "next";

export const gameMetadata: Metadata = {
  
  metadataBase: new URL("https://www.grandlineroulette.com"), 
  title: {
    default: "Grand Line Roulette | One Piece Spin Battle Game",
    template: "%s | Grand Line Roulette",
  },
  description: "Experience the ultimate One Piece strategy game. Spin the wheel, build your pirate crew, and dominate the Grand Line!",
  keywords: ["One Piece Game", "Anime Spin Battle", "Grand Line Roulette", "Pirate Strategy Game", "Luffy Game", "One Piece Power Scaling 2026", 
    "Strongest One Piece Characters List",
    "Luffy Gear 5 Battle Simulator",
    "One Piece Crew Builder Game",
    "Grand Line Roulette Strategy",
    "Anime Character Battle Rankings",
    "One Piece Strongest Alive 2026"],
  
  openGraph: {
    title: "Grand Line Roulette - Spin Your Pirate Destiny",
    description: "Build your crew and battle for the title of Pirate King!",
    url: "https://www.grandlineroulette.com",
    siteName: "Grand Line Roulette",
    images: [
      {
        url: "/images/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Grand Line Roulette Gameplay",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Grand Line Roulette",
    description: "The Will of Pirates awaits. Spin now!",
    images: ["/images/twitter-card.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
   
  

  
};


