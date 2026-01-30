import { CharacterData } from "../types/Character";

const API_URL = "http://localhost:5000";

export async function fetchCharacters(): Promise<CharacterData[]> {
  try {
    // 1. Try to connect to the Backend
    const response = await fetch(`${API_URL}/characters`, {
        cache: 'no-store', // Don't cache old data
        method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    // 2. If it fails, log the error clearly
    console.error("❌ Failed to fetch from backend. Is 'node server.js' running?", error);
    return []; // Return empty list so game doesn't crash
  }
}