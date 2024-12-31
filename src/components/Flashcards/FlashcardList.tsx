// src/components/Flashcards/FlashcardList.tsx

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
    fetchAllVocab();
  }, []);

  async function fetchAllVocab() {
    try {
      const resp = await fetch("http://127.0.0.1:5000/api/fsrs/vocabulary");
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || `Failed to fetch vocabulary`);
      }
      const data = await resp.json();
      if (data.words) {
        setAllCards(data.words);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const displayed = filteredLanguage
    ? allCards.filter(
        (c) => c.language.toLowerCase() === filteredLanguage.toLowerCase()
      )
    : allCards;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">All Flashcards</h2>

      <div className="form-control max-w-sm">
        <label className="label">
          <span className="label-text">Filter by Language:</span>
        </label>
        <select
          value={filteredLanguage}
          onChange={(e) => setFilteredLanguage(e.target.value)}
          className="select select-bordered"
        >
          <option value="">(All)</option>
          {supportedLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {displayed.length === 0 ? (
        <p className="text-gray-500">No flashcards found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Word</th>
                <th>Language</th>
                <th>Translation</th>
                <th>State</th>
                <th>Due</th>
                <th>Stability</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((card) => (
                <tr key={`${card.word}-${card.language}`}>
                  <td>{card.word}</td>
                  <td>{card.language}</td>
                  <td>{card.translation || ""}</td>
                  <td>{card.state}</td>
                  <td>{card.due || ""}</td>
                  <td>{card.stability?.toFixed(3)}</td>
                  <td>{card.difficulty?.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
