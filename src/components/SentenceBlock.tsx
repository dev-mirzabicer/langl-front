import React, { useMemo } from "react";
import { SentenceData, WordInfo } from "../types/translation";
import { WordToken } from "./WordToken";

// A set of distinct background colors from Tailwind for alignment highlighting
const colorPalette = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-orange-200",
  "bg-amber-200",
  "bg-lime-200",
  "bg-cyan-200",
  "bg-indigo-200",
  "bg-fuchsia-200",
  // Add more if needed
];

interface ColorizedToken {
  text: string;
  colorClass?: string;
}

// Takes the alignment array, source tokens, target tokens, and applies color classes
function buildColorMaps(
  srcTokens: string[],
  trgTokens: string[],
  alignment: Array<[number, number]>
) {
  const sourceColorized: ColorizedToken[] = srcTokens.map((w) => ({ text: w }));
  const targetColorized: ColorizedToken[] = trgTokens.map((w) => ({ text: w }));

  let colorIndex = 0;
  for (const [srcIdx, trgIdx] of alignment) {
    if (srcIdx < 0 || srcIdx >= sourceColorized.length) continue;
    if (trgIdx < 0 || trgIdx >= targetColorized.length) continue;

    const srcHasColor = sourceColorized[srcIdx].colorClass;
    const trgHasColor = targetColorized[trgIdx].colorClass;

    // If both uncolored, pick a new color from the palette
    if (!srcHasColor && !trgHasColor) {
      const color = colorPalette[colorIndex % colorPalette.length];
      sourceColorized[srcIdx].colorClass = color;
      targetColorized[trgIdx].colorClass = color;
      colorIndex++;
    }
    // If only one side has color, apply the same color to the other side
    else if (srcHasColor && !trgHasColor) {
      targetColorized[trgIdx].colorClass = srcHasColor;
    } else if (!srcHasColor && trgHasColor) {
      sourceColorized[srcIdx].colorClass = trgHasColor;
    }
    // If both have color but differ, you might unify them, but it’s rare in typical alignments.
    // We'll skip it here for clarity.
  }

  return { sourceColorized, targetColorized };
}

interface Props {
  sentence: SentenceData;
  showTranslation: boolean;
  showWordHints: boolean;
}

export function SentenceBlock({ sentence, showTranslation, showWordHints }: Props) {
  const { original, translated, src_tokenized, trg_tokenized, alignment, wordInfo } = sentence;

  // Build color-coded tokens for the source and target lines
  const { sourceColorized, targetColorized } = useMemo(() => {
    return buildColorMaps(src_tokenized, trg_tokenized, alignment);
  }, [src_tokenized, trg_tokenized, alignment]);

  // Render
  return (
    <div className="p-2 bg-gray-100 rounded">
      {/* SOURCE LINE (Swedish) */}
      <div className="flex flex-wrap gap-2">
        {sourceColorized.map((token, i) => {
          // We'll rely on wordInfo[i] to hold the FSRS data for token i
          const info: WordInfo | undefined = wordInfo[i];

          if (showWordHints && info) {
            // We show it as a WordToken with popover
            return (
              <WordToken
                key={i}
                info={info}
                colorClass={token.colorClass}
              />
            );
          } else {
            // If not showing popovers, just show the color-coded text
            return (
              <span
                key={i}
                className={`px-1 rounded ${token.colorClass || ""}`}
              >
                {token.text}
              </span>
            );
          }
        })}
      </div>

      {/* TARGET LINE (English), only shown if showTranslation = true */}
      {showTranslation && (
        <div className="mt-1 flex flex-wrap gap-2">
          {targetColorized.map((token, i) => (
            <span
              key={i}
              className={`px-1 rounded ${token.colorClass || ""}`}
            >
              {token.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
