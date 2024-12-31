// src/components/Reader/WordToken.tsx
import React, { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { WordInfo } from "../../types/translation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface Props {
  text: string;
  colorClass?: string;   // alignment color
  info: WordInfo;
  showHints: boolean;    // new prop => highlight known words if true
}

export function WordToken({ text, colorClass, info, showHints }: Props) {
  const [dictTranslation, setDictTranslation] = useState<string>("");
  const [isLoadingDict, setIsLoadingDict] = useState(false);
  const [isKnown, setIsKnown] = useState(info.found_in_vocabulary);
  const [fsrsData, setFsrsData] = useState(info.vocabulary_entry || null);

  useEffect(() => {
    // We'll do an immediate dictionary fetch
    fetchDictionaryTranslation(info.original_word, fsrsData?.language);
  }, [info.original_word]);

  async function fetchDictionaryTranslation(word: string, lang?: string) {
    if (!word) return;
    try {
      setIsLoadingDict(true);
      const languageQuery = lang || "SV";
      const params = new URLSearchParams({
        word: word,
        language: languageQuery.toLowerCase(),
      });
      const resp = await fetch(`http://127.0.0.1:5000/api/dictionary/lookup?${params}`);
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || resp.statusText);
      }
      const data = await resp.json();
      setDictTranslation(data.translation || "(No dictionary translation)");
    } catch (err) {
      console.error("Dictionary lookup error:", err);
      setDictTranslation("(Error fetching translation)");
    } finally {
      setIsLoadingDict(false);
    }
  }

  async function handleAddWord() {
    try {
      const resp = await fetch("http://127.0.0.1:5000/api/fsrs/vocabulary/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: info.original_word,
          language: fsrsData?.language || "sv",
          translation: dictTranslation || "",
        }),
      });
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || resp.statusText);
      }
      setIsKnown(true);
      refreshFsrsInfo();
    } catch (err) {
      console.error("Add word error:", err);
    }
  }

  async function handleRating(rating: string) {
    try {
      const resp = await fetch("http://127.0.0.1:5000/api/fsrs/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: info.original_word,
          language: fsrsData?.language || "sv",
          response: rating.toLowerCase(),
        }),
      });
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || resp.statusText);
      }
      refreshFsrsInfo();
    } catch (err) {
      console.error("FSRS update error:", err);
    }
  }

  async function refreshFsrsInfo() {
    try {
      const params = new URLSearchParams({
        word: info.original_word.toLowerCase(),
        language: (fsrsData?.language || "sv").toLowerCase(),
      });
      const resp = await fetch(
        `http://127.0.0.1:5000/api/fsrs/vocabulary/lookup?${params}`
      );
      if (!resp.ok) {
        // 404 => not found
        setFsrsData(null);
        setIsKnown(false);
        return;
      }
      const data = await resp.json();
      setFsrsData(data);
      setIsKnown(true);
    } catch (err) {
      console.error("Refresh FSRS info error:", err);
      setFsrsData(null);
      setIsKnown(false);
    }
  }

  // Build popover content:
  const popoverContent = (
    <div className="p-2 text-sm space-y-2 max-w-xs">
      <div className="font-bold flex items-center gap-1">
        {info.original_word}
        {isKnown && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
      </div>

      {isLoadingDict ? (
        <div className="text-gray-500">Loading dictionary...</div>
      ) : (
        <div>Dictionary: <strong>{dictTranslation}</strong></div>
      )}

      {isKnown && fsrsData ? (
        <div className="text-xs text-gray-600 space-y-2">
          <p>FSRS translation: {fsrsData.translation || "(none)"}</p>
          <p>Stability: {fsrsData.stability?.toFixed(2)}</p>
          <p>Difficulty: {fsrsData.difficulty?.toFixed(2)}</p>
          <div className="flex space-x-1">
            {["again", "hard", "good", "easy"].map((r) => (
              <button
                key={r}
                onClick={() => handleRating(r)}
                className="btn btn-xs"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-xs text-red-600">
          Not in your vocabulary yet.
          <div className="mt-1">
            <button
              onClick={handleAddWord}
              className="btn btn-xs btn-primary"
            >
              Add word
            </button>
          </div>
        </div>
      )}
    </div>
  );

  /**
   * Final CSS classes for the <span>.
   * - Always apply alignment color if present.
   * - If `showHints && isKnown`, let's highlight with e.g. "font-bold" or "underline".
   */
  let finalClass = colorClass || "";
  if (showHints && isKnown) {
    finalClass += " font-bold"; // or " underline" if you prefer
  }

  return (
    <Tippy content={popoverContent} interactive={true} delay={[0, 100]}>
      <span className={`${finalClass} cursor-pointer`}>
        {text}
      </span>
    </Tippy>
  );
}
