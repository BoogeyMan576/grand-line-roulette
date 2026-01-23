// src/data/characters.ts

// 1. Updated Interface to match the rest of the app
export interface CharacterData {
  id: number;
  name: string;
  image: string;
  bounty: string;
  role: string;
  // NEW FIELDS ADDED TO FIX TYPE ERROR:
  crew: string;
  haki: string[];
  devilFruit: string | null;
}

// 2. Updated Data with the new fields
export const LOCAL_CHARACTERS: CharacterData[] = [
  { 
    id: 1, 
    name: "Monkey D. Luffy", 
    image: "/images/spin/Luffy.png", 
    bounty: "3,000,000,000", 
    role: "Captain",
    crew: "Straw Hat Pirates",
    haki: ["Conqueror's", "Armament", "Observation"],
    devilFruit: "Hito Hito no Mi, Model: Nika"
  },
  { 
    id: 2, 
    name: "Roronoa Zoro", 
    image: "/images/spin/Zoro.png", 
    bounty: "1,111,000,000", 
    role: "Vice-Captain",
    crew: "Straw Hat Pirates",
    haki: ["Conqueror's", "Armament", "Observation"],
    devilFruit: null
  },
  { 
    id: 3, 
    name: "Nami", 
    image: "/images/spin/Nami.png", 
    bounty: "366,000,000", 
    role: "Navigator",
    crew: "Straw Hat Pirates",
    haki: [],
    devilFruit: null
  },
  { 
    id: 4, 
    name: "Sanji", 
    image: "/images/spin/Sanji.png", 
    bounty: "1,032,000,000", 
    role: "Cook",
    crew: "Straw Hat Pirates",
    haki: ["Armament", "Observation"],
    devilFruit: null
  },
  { 
    id: 5, 
    name: "Usopp", 
    image: "/images/spin/Usopp.png", 
    bounty: "500,000,000", 
    role: "Sniper",
    crew: "Straw Hat Pirates",
    haki: ["Observation"],
    devilFruit: null
  },
];

export const getRandomCharacter = () => {
  const index = Math.floor(Math.random() * LOCAL_CHARACTERS.length);
  return LOCAL_CHARACTERS[index];
};