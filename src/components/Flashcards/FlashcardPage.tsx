// src/components/Flashcards/FlashcardPage.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { FlashcardList } from "./FlashcardList";
import { StudyCards } from "./StudyCards";

export function FlashcardPage() {
  return (
    <div className="p-4">
      <Routes>
        <Route path="/" element={<Navigate to="list" replace />} />
        <Route path="list" element={<FlashcardList />} />
        <Route path="study" element={<StudyCards />} />
        <Route path="*" element={<FlashcardList />} />
      </Routes>
    </div>
  );
}