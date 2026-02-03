// This is NOT data. This is a Rulebook for your JSON.
export interface CharacterData {
  id: number;           // Your JSON has 1 (number), not "1" (string)
  name: string;
  image: string;
  bounty?: string;      // Optional (marked by ?)
  
  // --- THESE ARE THE FIELDS FROM YOUR JSON ---
  role?: string;        // "Captain / Yonko"
  crew?: string;        // "Straw Hat Pirates"
  devilFruit?: string;  // "Hito Hito no Mi..."
  status?: string;      // "Alive"
  
  // Your JSON has a list of strings for Haki
  haki?: string[];      
}