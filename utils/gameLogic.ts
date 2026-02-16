// src/utils/gameLogic.ts
import { CharacterData } from "../types/Character";

export const calculatePower = (char: CharacterData | null | undefined): number => {
  if (!char) return 0;

  const searchStr = `${char.name} ${char.role} ${char.crew} ${char.devilFruit}`.toLowerCase();
  let power = 0;

  // 1. BASE RANKING (Lookup Object)
  // We use an array of pairs so we can maintain the order of importance
  const baseRanks = [
    { keys: ["imu", "joyboy", "sun god", "rocks"], value: 8500 },
    { keys: ["king of pirates", "gorosei", "warrior god"], value: 7000 },
    { keys: ["yonko"], value: 5500 },
    { keys: ["fleet admiral", "admiral"], value: 4500 },
    { keys: ["commander", "warlord", "right hand", "chief of staff"], value: 3500 },
    { keys: ["supernova", "vice admiral", "cp0", "sword", "worst generation"], value: 2500 },
    { keys: ["officer", "headliner", "cp9", "tobi roppo"], value: 1500 },
    { keys: ["seaman", "chore boy", "recruit"], value: 100 },
  ];

  // Find the first rank that matches a keyword
  const matchedRank = baseRanks.find(rank => rank.keys.some(k => searchStr.includes(k)));
  power = matchedRank ? matchedRank.value : 800;

  // 2. SPECIAL BONUSES
  if (searchStr.includes("lunarian") || searchStr.includes("seraphim")) power += 1500;
  if (searchStr.includes("giant")) power += 500;
  if (searchStr.includes("mythical") || searchStr.includes("god") || searchStr.includes("dragon")) power += 800;
  if (searchStr.includes("germa") || searchStr.includes("vinsmoke")) power += 400;

  // 3. HAKI BONUSES
  if (char.haki && Array.isArray(char.haki)) {
    const hakiStr = char.haki.join(" ").toLowerCase();
    
    // Logic Mapping for Haki
    if (hakiStr.includes("advanced haoshoku") || hakiStr.includes("advanced conqueror")) power += 1500;
    else if (hakiStr.includes("haoshoku")) power += 700;

    if (hakiStr.includes("ryou") || hakiStr.includes("advanced busoshoku")) power += 600;
    else if (hakiStr.includes("busoshoku")) power += 300;

    if (hakiStr.includes("future sight") || hakiStr.includes("advanced kenbunshoku")) power += 600;
    else if (hakiStr.includes("kenbunshoku")) power += 200;
  }

  // 4. BOUNTY ADJUSTMENT
  if (char.bounty && char.bounty !== "N/A") {
    const bountyVal = parseInt(char.bounty.replace(/[^0-9]/g, "")) || 0;
    power += Math.min(Math.floor(bountyVal / 10000000), 600);
  }

  // 5. WORLD ORIGIN BONUS
  if (typeof window !== "undefined") {
    const savedWorld = localStorage.getItem("selectedWorld");
    if (savedWorld && savedWorld !== "none" && char.origin) {
      const cleanSavedWorld = savedWorld.toLowerCase().replace(/-/g, " ");
      if (char.origin.toLowerCase().includes(cleanSavedWorld)) power += 1500;
    }
  }

  return power;
};