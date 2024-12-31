// src/components/Reader/SentenceBlock.tsx

import React, { useMemo } from "react";
import { SentenceData } from "../../types/translation";
import { WordToken } from "./WordToken";

interface ColorizedToken {
  text: string;
  colorClass?: string;
}

const colorPalette = [
  "text-red-700",
  "text-blue-700",
  "text-green-700",
  "text-yellow-800",
  "text-purple-700",
  "text-pink-700",
  "text-orange-700",
  "text-emerald-700",
  "text-cyan-700",
  "text-indigo-700",
  "text-fuchsia-700",
];

/**
 * Builds color maps if colorMatching=true, else leaves them blank.
 */
function buildColorMaps(
  srcTokens: string[],
  trgTokens: string[],
  alignment: Array<[number, number]>,
  colorMatching: boolean
) {
  const sourceColorized: ColorizedToken[] = srcTokens.map((w) => ({ text: w }));
  const targetColorized: ColorizedToken[] = trgTokens.map((w) => ({ text: w }));

  if (!colorMatching) {
    return { sourceColorized, targetColorized };
  }

  let colorIndex = 0;
  for (const [srcIdx, trgIdx] of alignment) {
    if (
      srcIdx < 0 ||
      srcIdx >= sourceColorized.length ||
      trgIdx < 0 ||
      trgIdx >= targetColorized.length
    )
      continue;

    const srcHasColor = sourceColorized[srcIdx].colorClass;
    const trgHasColor = targetColorized[trgIdx].colorClass;

    if (!srcHasColor && !trgHasColor) {
      const color = colorPalette[colorIndex % colorPalette.length];
      sourceColorized[srcIdx].colorClass = color;
      targetColorized[trgIdx].colorClass = color;
      colorIndex++;
    } else if (srcHasColor && !trgHasColor) {
      targetColorized[trgIdx].colorClass = srcHasColor;
    } else if (!srcHasColor && trgHasColor) {
      sourceColorized[srcIdx].colorClass = trgHasColor;
    }
  }

  return { sourceColorized, targetColorized };
}

interface Props {
  sentence: SentenceData;
  showTranslation: boolean;
  showWordHints: boolean;   // If true => highlight known words in <WordToken>
  colorMatching: boolean;
}

export function SentenceBlock({
  sentence,
  showTranslation,
  showWordHints,
  colorMatching,
}: Props) {
  const { src_tokenized, trg_tokenized, alignment, wordInfo } = sentence;

  const { sourceColorized, targetColorized } = useMemo(() => {
    return buildColorMaps(src_tokenized, trg_tokenized, alignment, colorMatching);
  }, [src_tokenized, trg_tokenized, alignment, colorMatching]);

  return (
    <div className="p-2 border rounded bg-base-100">
      {/* Source line => ALWAYS <WordToken> so popovers always exist */}
      <div className="flex flex-wrap gap-1">
        {sourceColorized.map((token, i) => {
          const info = wordInfo[i];
          return (
            <WordToken
              key={i}
              text={token.text}
              colorClass={token.colorClass}
              info={info}
              showHints={showWordHints} // pass the toggle
            />
          );
        })}
      </div>

      {/* Target line => only if showTranslation = true */}
      {showTranslation && (
        <div className="mt-2 flex flex-wrap gap-1">
          {targetColorized.map((token, i) => (
            <span key={i} className={token.colorClass}>
              {token.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
