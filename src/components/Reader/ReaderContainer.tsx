// src/components/Reader/ReaderContainer.tsx
import React, { useState } from "react";
import { TranslationResponse, SentenceData } from "../../types/translation";
import { FloatingControls } from "./FloatingControls";
import { SentenceBlock } from "./SentenceBlock";

interface Props {
  translationData: TranslationResponse;
}

/**
 * This container shows the translated sentences, plus the floating toggles.
 */
export function ReaderContainer({ translationData }: Props) {
  const { sentences } = translationData;

  // We store the states for toggles here.
  const [showTranslation, setShowTranslation] = useState(true);
  const [showWordHints, setShowWordHints] = useState(true);
  const [colorMatching, setColorMatching] = useState(true);

  if (!sentences || sentences.length === 0) {
    // Fallback if the backend didn't split sentences
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Translation:</h2>
        <p>{translationData.translatedText}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Render each sentence */}
      <div className="space-y-4">
        {sentences.map((sentence: SentenceData, idx: number) => (
          <SentenceBlock
            key={idx}
            sentence={sentence}
            showTranslation={showTranslation}
            showWordHints={showWordHints}
            colorMatching={colorMatching}
          />
        ))}
      </div>

      {/* The floating control bar at bottom center */}
      <FloatingControls
        showTranslation={showTranslation}
        setShowTranslation={setShowTranslation}
        showWordHints={showWordHints}
        setShowWordHints={setShowWordHints}
        colorMatching={colorMatching}
        setColorMatching={setColorMatching}
      />
    </div>
  );
}
