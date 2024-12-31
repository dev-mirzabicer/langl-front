// src/routes/FlashcardRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import { FlashcardPage } from "../components/Flashcards/FlashcardPage";
import { FlashcardList } from "../components/Flashcards/FlashcardList";
import { StudyCards } from "../components/Flashcards/StudyCards";

/**
 * We define a parent route "/flashcards" => <FlashcardPage/>,
 * then let the <FlashcardPage/> itself handle sub-routes (list, study, etc.).
 */
export function FlashcardRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="list" replace />} />
        <Route path="list" element={<FlashcardList />} />
        <Route path="study" element={<StudyCards />} />
        <Route path="*" element={<FlashcardList />} />
      </Routes>
  );
}
