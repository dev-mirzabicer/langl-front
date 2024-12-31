// src/components/FlashcardList.tsx
import React, { useEffect, useState } from "react";

interface VocabEntry {
  word: string;
  language: string;
  translation: string | null;
  state: number;
  due: string | null;
  stability: number;
  difficulty: number;
  last_review: string | null;
  step: number;
}

const supportedLanguages = ["EN", "SV", "DE", "FR", "ES", "JA", "ZH"];

export function FlashcardList() {
  const [allCards, setAllCards] = useState<VocabEntry[]>([]);
  const [filteredLanguage, setFilteredLanguage] = useState<string>("");

  useEffect(() => {
    // fetch all vocabulary
    fetchAllVocab();
  }, []);

  const fetchAllVocab = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:5000/api/fsrs/vocabulary");
      if (!resp.ok) {
        throw new Error(`Failed to fetch vocabulary: ${resp.statusText}`);
      }
      const data = await resp.json();
      if (data.words) {
        setAllCards(data.words);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter by language if user picks one
  const displayed = filteredLanguage
    ? allCards.filter((c) => c.language.toLowerCase() === filteredLanguage.toLowerCase())
    : allCards;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">All Flashcards</h2>
      <div className="mb-2">
        <label className="mr-2">Filter by Language:</label>
        <select
          value={filteredLanguage}
          onChange={(e) => setFilteredLanguage(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">(All)</option>
          {supportedLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Word</th>
            <th className="border px-2 py-1">Language</th>
            <th className="border px-2 py-1">Translation</th>
            <th className="border px-2 py-1">State</th>
            <th className="border px-2 py-1">Due</th>
            <th className="border px-2 py-1">Stability</th>
            <th className="border px-2 py-1">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((card) => (
            <tr key={`${card.word}-${card.language}`}>
              <td className="border px-2 py-1">{card.word}</td>
              <td className="border px-2 py-1">{card.language}</td>
              <td className="border px-2 py-1">{card.translation || ""}</td>
              <td className="border px-2 py-1">{card.state}</td>
              <td className="border px-2 py-1">{card.due || ""}</td>
              <td className="border px-2 py-1">{card.stability?.toFixed(3)}</td>
              <td className="border px-2 py-1">{card.difficulty?.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
