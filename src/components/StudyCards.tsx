// src/components/StudyCards.tsx
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

  // 1. Fetch all due words
  const fetchDueWords = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:5000/api/fsrs/review");
      if (!resp.ok) {
        throw new Error(`Failed to fetch due words: ${resp.statusText}`);
      }
      const data = await resp.json();
      if (data.words) {
        // data.words is an array of { word, language, translation }
        setDueWords(data.words);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Filter by language if user picks
  const displayed = selectedLanguage
    ? dueWords.filter((w) => w.language.toLowerCase() === selectedLanguage.toLowerCase())
    : dueWords;

  // 3. The card being shown
  const card = displayed[currentIndex];

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  // 4. On rating => call /api/fsrs/update => fetch new data or just move on
  const handleRating = async (rating: string) => {
    if (!card) return;

    try {
      const resp = await fetch("http://127.0.0.1:5000/api/fsrs/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: card.word,
          language: card.language,
          response: rating
        })
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || `FSRS update failed: ${resp.statusText}`);
      }
      console.log(`FSRS rating updated for word '${card.word}': ${rating}`);

      // Move to next card
      setShowAnswer(false);
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Study (Due Cards)</h2>

      <div className="mb-2">
        <label className="mr-2">Filter by Language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => {
            setSelectedLanguage(e.target.value);
            setCurrentIndex(0);
            setShowAnswer(false);
          }}
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

      {card ? (
        <div className="border p-4 rounded shadow w-80">
          <p className="text-lg font-bold mb-2">Word: {card.word}</p>
          {!showAnswer ? (
            <button
              onClick={handleShowAnswer}
              className="bg-blue-500 text-white py-1 px-3 rounded"
            >
              Show Answer
            </button>
          ) : (
            <>
              <p className="mb-4">Translation: {card.translation || "(no translation)"}</p>
              <div className="flex space-x-2">
                {["again", "hard", "good", "easy"].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRating(r)}
                    className="bg-gray-200 hover:bg-gray-300 text-sm px-2 py-1 rounded"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <p>No due cards for this language.</p>
      )}
    </div>
  );
}
