// src/components/ReaderContainer.tsx
import React, { useState } from "react";
import { TranslationResponse } from "../types/translation";
import { SentenceBlock } from "./SentenceBlock";

const supportedLanguages = ["EN", "SV", "DE", "FR", "ES", "JA", "ZH"];

export function ReaderContainer() {
  const [sourceText, setSourceText] = useState("");
  const [translationData, setTranslationData] = useState<TranslationResponse | null>(null);

  const [showTranslation, setShowTranslation] = useState(true);
  const [showWordHints, setShowWordHints] = useState(true);

  // NEW: user-selectable source/target languages
  const [sourceLanguage, setSourceLanguage] = useState("SV");  // default to Swedish
  const [targetLanguage, setTargetLanguage] = useState("EN");  // default to English

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    try {
      const resp = await fetch("http://127.0.0.1:5000/api/translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          sourceLanguage: sourceLanguage.toUpperCase(),
          targetLanguage: targetLanguage.toUpperCase(),
          splitSentences: true,
          markWords: true
        })
      });
      if (!resp.ok) {
        throw new Error(`Translation request failed: ${resp.statusText}`);
      }
      const data: TranslationResponse = await resp.json();
      setTranslationData(data);
    } catch (err) {
      console.error("Error during translation:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Language selection row */}
      <div className="flex items-center space-x-4">
        <div>
          <label>Source: </label>
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Target: </label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Toggler row for show/hide translations/word hints */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showTranslation}
            onChange={() => setShowTranslation(!showTranslation)}
          />
          <span>Show Sentence Translation</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showWordHints}
            onChange={() => setShowWordHints(!showWordHints)}
          />
          <span>Show Word Hints (Popovers)</span>
        </label>
      </div>

      {/* 3. Text input area */}
      <textarea
        className="w-full h-40 p-2 border rounded"
        placeholder={`Type or paste text in ${sourceLanguage} here...`}
        value={sourceText}
        onChange={(e) => setSourceText(e.target.value)}
      />

      <button
        onClick={handleTranslate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Translate
      </button>

      {/* 4. Render results */}
      {translationData?.sentences && (
        <div className="mt-4 space-y-4">
          {translationData.sentences.map((sentence, idx) => (
            <SentenceBlock
              key={idx}
              sentence={sentence}
              showTranslation={showTranslation}
              showWordHints={showWordHints}
            />
          ))}
        </div>
      )}
    </div>
  );
}
