// app/components/JsonLd.tsx
export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "Grand Line Roulette",
    "description": "The ultimate One Piece strategy spin game. Build your pirate crew and battle for the Grand Line.",
    "genre": ["Strategy", "Anime Battle", "Spin Game"],
    "playMode": "SinglePlayer, MultiPlayer",
    "applicationCategory": "Game",
    "character": [
      { "@type": "Person", "name": "Monkey D. Luffy", "jobTitle": "Captain" },
      { "@type": "Person", "name": "Roronoa Zoro", "jobTitle": "Vice Captain" }
    ],
    "author": {
      "@type": "Person",
      "name": "Nirmal Rabari" // Your name as the creator
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}