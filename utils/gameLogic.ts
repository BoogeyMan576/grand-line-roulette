// src/utils/gameLogic.ts
import { CharacterData } from "../types/Character";

// 1. Update the type to accept 'null' or 'undefined'
export const calculatePower = (char: CharacterData | null | undefined): number => {
  
  // 2. SAFETY CHECK: If the slot is empty (null), return 0 power immediately.
  // This prevents the "Cannot read properties of null" crash.
  if (!char) return 0;

  let power = 0;
  
  // Combine all text for searching
  const searchStr = (
    (char.name || "") + " " + 
    (char.role || "") + " " + 
    (char.crew || "") + " " + 
    (char.devilFruit || "")
  ).toLowerCase();
  
  // =========================================================
  // 1. BASE RANKING (Based on Role & Crew)
  // =========================================================
  
  if (searchStr.includes("imu") || searchStr.includes("joyboy") || searchStr.includes("rocks") || searchStr.includes("sun god")) {
    power = 6000;
  } 
  else if (searchStr.includes("king of pirates") || searchStr.includes("yonko") || searchStr.includes("gorosei") || searchStr.includes("warrior god")) {
    power = 5000;
  } 
  else if (searchStr.includes("fleet admiral") || searchStr.includes("admiral")) {
    power = 4000;
  } 
  else if (searchStr.includes("commander") || searchStr.includes("warlord") || searchStr.includes("right hand") || searchStr.includes("chief of staff")) {
    power = 3000;
  } 
  else if (searchStr.includes("supernova") || searchStr.includes("vice admiral") || searchStr.includes("cp0") || searchStr.includes("sword") || searchStr.includes("worst generation")) {
    power = 2000;
  } 
  else if (searchStr.includes("officer") || searchStr.includes("headliner") || searchStr.includes("cp9") || searchStr.includes("tobi roppo")) {
    power = 1000;
  } 
  else if (searchStr.includes("seaman") || searchStr.includes("chore boy") || searchStr.includes("recruit")) {
    power = 50; 
  }
  else {
    power = 300; 
  }

  // =========================================================
  // 2. SPECIAL BONUSES
  // =========================================================
  if (searchStr.includes("lunarian") || searchStr.includes("seraphim")) power += 1000;
  if (searchStr.includes("giant")) power += 500;
  if (searchStr.includes("mythical") || searchStr.includes("god") || searchStr.includes("dragon")) power += 500;
  if (searchStr.includes("germa") || searchStr.includes("vinsmoke")) power += 400;

  // =========================================================
  // 3. HAKI BONUSES
  // =========================================================
  if (char.haki && Array.isArray(char.haki)) {
      const hakiStr = char.haki.join(" ").toLowerCase();
      
      if (hakiStr.includes("advanced haoshoku") || hakiStr.includes("advanced conqueror")) {
          power += 1000; 
      } else if (hakiStr.includes("haoshoku")) {
          power += 500;
      }

      if (hakiStr.includes("ryou") || hakiStr.includes("advanced busoshoku")) {
          power += 400;
      } else if (hakiStr.includes("busoshoku")) {
          power += 200;
      }

      if (hakiStr.includes("future sight") || hakiStr.includes("advanced kenbunshoku")) {
          power += 400;
      } else if (hakiStr.includes("kenbunshoku")) {
          power += 100;
      }
  }

  // =========================================================
  // 4. BOUNTY ADJUSTMENT
  // =========================================================
  if (char.bounty && char.bounty !== "N/A") {
      const bountyVal = parseInt(char.bounty.replace(/[^0-9]/g, '')) || 0;
      power += Math.floor(bountyVal / 10000000); 
  }

  return power;
};