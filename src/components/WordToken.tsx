import React, { useState, useEffect } from "react";
import { WordInfo } from "../types/translation";
import { FSRSButtons } from "./FSRSButtons";
import { SpeakerWaveIcon } from "@heroicons/react/24/outline";

/** 
 * A minimal shape for storing the FSRS data once we fetch it. 
 * You might store more fields if needed.
 */
interface FSRSData {
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

interface Props {
  info: WordInfo;       // The initial info from translation
  colorClass?: string;  // Alignment highlight color
}

export function WordToken({ info, colorClass }: Props) {
  const [showPopover, setShowPopover] = useState(false);

  const {
    original_word,
    found_in_vocabulary,
    vocabulary_entry
  } = info;

  // We'll keep a piece of local FSRS state. Initially from WordInfo if known, else undefined.
  const [fsrsData, setFsrsData] = useState<FSRSData | null>(() => {
    if (found_in_vocabulary && vocabulary_entry) {
      return {
        word: vocabulary_entry.word,
        language: vocabulary_entry.language,
        translation: vocabulary_entry.translation,
        state: vocabulary_entry.state,
        due: vocabulary_entry.due,
        stability: vocabulary_entry.stability,
        difficulty: vocabulary_entry.difficulty,
        last_review: vocabulary_entry.last_review,
        step: vocabulary_entry.step
      };
    }
    return null;
  });

  const isKnown = fsrsData != null;

  // We'll store a dictionary translation from /api/dictionary/lookup
  const [dictTranslation, setDictTranslation] = useState<string>("");

  // On popover open, fetch single-word dictionary + also refresh FSRS data 
  useEffect(() => {
    if (showPopover) {
      fetchDictionaryTranslation(original_word);
      refreshFSRSInfo(original_word, "sv");
    }
  }, [showPopover]);

  // Dictionary: from /api/dictionary/lookup
  const fetchDictionaryTranslation = async (word: string) => {
    try {
      const params = new URLSearchParams({ word, language: "sv" });
      const resp = await fetch(`http://127.0.0.1:5000/api/dictionary/lookup?${params}`);
      if (!resp.ok) {
        throw new Error(`Dictionary lookup failed: ${resp.statusText}`);
      }
      const data = await resp.json();
      if (data.translation) {
        setDictTranslation(data.translation);
      } else {
        setDictTranslation("(No dictionary translation found)");
      }
    } catch (err) {
      console.error(err);
      setDictTranslation("(Error fetching translation)");
    }
  };

  // FSRS: from /api/fsrs/vocabulary/lookup
  const refreshFSRSInfo = async (word: string, language: string) => {
    try {
      const params = new URLSearchParams({ word: word.toLowerCase(), language: language.toLowerCase() });
      const resp = await fetch(`http://127.0.0.1:5000/api/fsrs/vocabulary/lookup?${params}`);
      if (resp.ok) {
        const data = await resp.json();
        setFsrsData(data);  // update local FSRS data
      } else {
        // If 404 => means not in vocab
        setFsrsData(null);
      }
    } catch (err) {
      console.error(err);
      setFsrsData(null);
    }
  };

  // TTS for Swedish words
  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(original_word);
    utterance.lang = "sv-SE";
    speechSynthesis.speak(utterance);
  };

  // Add word => let server fetch translation => then refresh FSRS data
  const handleAddWord = async () => {
    if (!original_word.trim()) return;
    try {
      const resp = await fetch("http://127.0.0.1:5000/api/fsrs/vocabulary/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: original_word,
          language: "sv",
          translation: ""
        })
      });
      if (!resp.ok) {
        throw new Error(`Failed to add word: ${resp.statusText}`);
      }
      // Once added, refresh FSRS info
      refreshFSRSInfo(original_word, "sv");
    } catch (err) {
      console.error("Add word error:", err);
    }
  };

  return (
    <span className="relative">
      <span
        className={`
          cursor-pointer px-1 py-0.5 rounded 
          ${colorClass || ""}
          ${isKnown ? "ring-1 ring-green-300" : "ring-1 ring-orange-300"}
        `}
        onClick={() => setShowPopover(!showPopover)}
      >
        {original_word}
      </span>

      {showPopover && (
        <div
          className="absolute top-full left-0 mt-1 z-50 bg-white border rounded shadow-lg p-3 w-64"
          onMouseLeave={() => setShowPopover(false)}
        >
          {/* Title row: word + TTS icon */}
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">{original_word}</div>
            <button onClick={handleSpeak}>
              <SpeakerWaveIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Always show dictionary translation */}
          <p className="text-sm text-gray-800 mb-2">
            Dictionary: <strong>{dictTranslation}</strong>
          </p>

          {/* If known, show FSRS data + rating; else show "Add Word" */}
          {isKnown && fsrsData ? (
            <>
              <p className="text-sm text-gray-600 mb-2">
                FSRS stored translation:{" "}
                <strong>
                  {fsrsData.translation || "(No FSRS translation stored)"}
                </strong>
              </p>
              <FSRSButtons
                word={fsrsData.word}
                language={fsrsData.language}
                onRatingSuccess={() => {
                  // Refresh after rating
                  refreshFSRSInfo(fsrsData.word, fsrsData.language);
                }}
              />
            </>
          ) : (
            <>
              <p className="text-sm text-red-500 mb-2">
                Not in your vocabulary yet.
              </p>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                onClick={handleAddWord}
              >
                Add word
              </button>
            </>
          )}
        </div>
      )}
    </span>
  );
}
