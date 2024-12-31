// FSRSButtons.tsx
import React from "react";

interface Props {
  word: string;
  language: string;
  onRatingSuccess?: () => void; // callback to refresh local data
}

export function FSRSButtons({ word, language, onRatingSuccess }: Props) {
  const handleRating = async (rating: string) => {
    try {
      // Send rating in lowercase
      const resp = await fetch("http://127.0.0.1:5000/api/fsrs/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word,
          language,
          response: rating.toLowerCase() // again|hard|good|easy
        })
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || `FSRS update failed: ${resp.statusText}`);
      }
      console.log(`FSRS rating updated for word '${word}': ${rating}`);
      onRatingSuccess?.(); // refresh FSRS data
    } catch (err) {
      console.error(err);
    }
  };

  return (
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
  );
}
