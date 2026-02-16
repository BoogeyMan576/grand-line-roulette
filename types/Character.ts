// src/types/Character.ts
export interface CharacterData {
  id: number;
  name: string;
  image: string;
  bounty: string;
  role: string;
  crew: string;
  haki: string[];
  devilFruit: string | null;
  status: string;
  origin?: string;
}