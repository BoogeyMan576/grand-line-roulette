// src/utils/onePieceApi.ts

export interface CharacterData {
  id: number;
  name: string;
  image: string; // URL from the internet
  bounty: string;
  crew: string;
  role: string;
  haki: string[];
  devilFruit: string | null;
}

// We will use a public API. 
// Note: Public APIs can sometimes be slow.
const API_URL = "https://api.api-onepiece.com/v2/characters/en";

export async function fetchRandomCharacter(): Promise<CharacterData> {
  try {
    // 1. Fetch a random ID (The API has roughly 800-1200 chars)
    // We fetch a specific random ID to get a single character
    const randomId = Math.floor(Math.random() * 800) + 1;
    
    const response = await fetch(`${API_URL}/${randomId}`);
    
    if (!response.ok) {
        // If API fails, return a fallback "Unknown Pirate"
        return getFallbackCharacter();
    }

    const data = await response.json();

    // 2. Format the API data to match our game
    return {
      id: data.id,
      name: data.name,
      // If the API has no image, use a placeholder
      image: data.id % 2 === 0 ? "/images/spin/Captain.png" : "/images/spin/Captain.png", // Replace this line if API returns actual 'image_url'
      // NOTE: Many free APIs don't host images directly to save cost. 
      // If this API returns an image URL, use: data.image_url 
      
      bounty: data.bounty ? data.bounty : "Unknown",
      crew: data.crew ? data.crew.name : "Rogue Pirate",
      role: data.job ? data.job : "Pirate",
      haki: data.haki ? data.haki : [],
      devilFruit: data.fruit ? data.fruit.name : null,
    };

  } catch (error) {
    console.error("API Error:", error);
    return getFallbackCharacter();
  }
}

function getFallbackCharacter(): CharacterData {
    return {
        id: 0,
        name: "Unknown Pirate",
        image: "/images/spin/Captain.png", // Ensure you have this placeholder locally
        bounty: "0",
        crew: "None",
        role: "Civilian",
        haki: [],
        devilFruit: null
    };
}