// src/components/Reader/FloatingControls.tsx

import React from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  QuestionMarkCircleIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";

interface Props {
  showTranslation: boolean;
  setShowTranslation: (val: boolean) => void;
  showWordHints: boolean;
  setShowWordHints: (val: boolean) => void;
  colorMatching: boolean;
  setColorMatching: (val: boolean) => void;
}

export function FloatingControls({
  showTranslation,
  setShowTranslation,
  showWordHints,
  setShowWordHints,
  colorMatching,
  setColorMatching,
}: Props) {
  // We’ll add a small helper to conditionally style the icons
  const iconClass = (isActive: boolean) =>
    isActive ? "opacity-100" : "opacity-40"; // dim if not active

  return (
    <div
      className="
        fixed bottom-4 left-1/2 transform -translate-x-1/2 
        flex items-center space-x-4
        p-3 bg-white/80 backdrop-blur-md 
        border border-gray-200 rounded-full shadow-xl
        z-50
      "
    >
      {/* Show/hide translation */}
      <button
        onClick={() => setShowTranslation(!showTranslation)}
        className="btn btn-sm btn-ghost"
        title="Toggle sentence translation"
      >
        {showTranslation ? (
          <EyeIcon className="w-5 h-5" />
        ) : (
          <EyeSlashIcon className="w-5 h-5" />
        )}
      </button>

      {/* Show/hide word hints */}
      <button
        onClick={() => setShowWordHints(!showWordHints)}
        className="btn btn-sm btn-ghost"
        title="Toggle word hints"
      >
        <QuestionMarkCircleIcon
          className={`w-5 h-5 ${iconClass(showWordHints)}`}
        />
      </button>

      {/* Toggle color matching */}
      <button
        onClick={() => setColorMatching(!colorMatching)}
        className="btn btn-sm btn-ghost"
        title="Toggle color matching"
      >
        <PaintBrushIcon
          className={`w-5 h-5 ${iconClass(colorMatching)}`}
        />
      </button>
    </div>
  );
}
