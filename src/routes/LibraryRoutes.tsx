// src/routes/LibraryRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { TextLibrary } from "../pages/TextLibrary";
import { NewTextPage } from "../pages/NewTextPage";

export function LibraryRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TextLibrary />} />
      <Route path="new" element={<NewTextPage />} />
      {/* Could add more sub-routes if needed */}
    </Routes>
  );
}
