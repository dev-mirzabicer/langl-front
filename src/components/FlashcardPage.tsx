// src/components/FlashcardPage.tsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { FlashcardList } from "./FlashcardList";
import { StudyCards } from "./StudyCards";

export function FlashcardPage() {
  return (
    <div>
      {/* Nav for sub-pages */}
      <div className="mb-4 flex space-x-4">
        <Link to="list" className="underline text-blue-600">
          All Flashcards
        </Link>
        <Link to="study" className="underline text-blue-600">
          Study
        </Link>
      </div>

      <Routes>
        <Route path="list" element={<FlashcardList />} />
        <Route path="study" element={<StudyCards />} />
        {/* Default sub-route => list */}
        <Route path="*" element={<FlashcardList />} />
      </Routes>
    </div>
  );
}
