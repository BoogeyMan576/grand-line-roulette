import { CharacterData } from "../types/Character";

// Ensure this matches your backend port
const API_URL = "http://localhost:5000"; 
// const API_URL = "";

export async function fetchCharacters(): Promise<CharacterData[]> {
  try {
    // ✅ FIX: Added "/api" to match your server.js route
    const response = await fetch(`${API_URL}/api/characters`, {
        cache: 'no-store',
        method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("❌ Failed to fetch from backend.", error);
    return [];
  }
}