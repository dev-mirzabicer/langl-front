// src/components/Flashcards/StudyCards.tsx

import React, { useEffect, useState } from "react";

interface DueWord {
  word: string;
  language: string;
  translation: string | null;
}

const supportedLanguages = ["EN", "SV", "DE", "FR", "ES", "JA", "ZH"];

export function StudyCards() {
  const [dueWords, setDueWords] = useState<DueWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    fetchDueWords();
  }, []);

  async function fetchDueWords() {
    try {
      const resp = await fetch("http://127.0.0.1:5000/api/fsrs/review");
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || `Failed to fetch due words`);
      }
      const data = await resp.json();
      if (data.words) {
        setDueWords(data.words);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Filter by selectedLanguage
  const displayed = selectedLanguage
    ? dueWords.filter(
        (w) => w.language.toLowerCase() === selectedLanguage.toLowerCase()
      )
    : dueWords;

  // The card being shown
  const card = displayed[currentIndex];

  // Handle rating => call /api/fsrs/update => move to next card
  async function handleRating(rating: string) {
    if (!card) return;
    try {
      const resp = await fetch("http://127.0.0.1:5000/api/fsrs/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: card.word,
          language: card.language,
          response: rating.toLowerCase(),
        }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || resp.statusText);
      }
      // Move on
      setShowAnswer(false);
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Study (Due Cards)</h2>

      <div className="form-control max-w-sm mb-4">
        <label className="label">
          <span className="label-text">Filter by Language:</span>
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => {
            setSelectedLanguage(e.target.value);
            setCurrentIndex(0);
            setShowAnswer(false);
          }}
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

      {card ? (
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">
              Word: <span className="font-mono">{card.word}</span>
            </h3>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="btn btn-primary mt-4"
              >
                Show Answer
              </button>
            ) : (
              <div className="mt-4 space-y-2">
                <p className="text-lg">
                  Translation:{" "}
                  <span className="font-bold">
                    {card.translation || "(no translation)"}
                  </span>
                </p>
                <div className="flex space-x-2">
                  {["again", "hard", "good", "easy"].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRating(r)}
                      className="btn btn-sm"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>No due cards for this language.</p>
      )}
    </div>
  );
}
