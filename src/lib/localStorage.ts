// src/lib/localStorage.ts
import { v4 as uuidv4 } from "uuid";

/**
 * We define a type for the saved text items.
 */
export interface SavedText {
  id: string;
  title: string;
  content: string;
  sourceLang: string; // e.g. "SV", "EN", etc.
  createdAt: string; // ISO date
}

const STORAGE_KEY = "myLanguageLearnerTexts";

/**
 * Reads the array of SavedText from localStorage.
 * Returns an empty array if none found.
 */
export function loadTexts(): SavedText[] {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return [];
  try {
    const arr = JSON.parse(json) as SavedText[];
    if (Array.isArray(arr)) return arr;
    return [];
  } catch (err) {
    console.error("Failed to parse localStorage texts:", err);
    return [];
  }
}

/**
 * Overwrites the entire array of SavedText in localStorage.
 */
export function saveTexts(texts: SavedText[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(texts));
}

/**
 * Creates a new text item and stores it in localStorage.
 * Returns the newly created item.
 */
export function createText(
  title: string,
  content: string,
  sourceLang: string
): SavedText {
  const newItem: SavedText = {
    id: uuidv4(),
    title: title.trim() || "Untitled",
    content: content.trim(),
    sourceLang: sourceLang.toUpperCase(),
    createdAt: new Date().toISOString(),
  };
  const texts = loadTexts();
  texts.push(newItem);
  saveTexts(texts);
  return newItem;
}

/**
 * Retrieves a specific text by ID.
 * Returns null if not found.
 */
export function getTextById(id: string): SavedText | null {
  const texts = loadTexts();
  return texts.find((t) => t.id === id) || null;
}

/**
 * Optionally, you could add an update or delete function, e.g.:
 */
export function deleteText(id: string): void {
  const texts = loadTexts();
  const filtered = texts.filter((t) => t.id !== id);
  saveTexts(filtered);
}
