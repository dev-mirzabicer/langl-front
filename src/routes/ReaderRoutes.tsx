// src/routes/ReaderRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ReaderPage } from "../pages/ReaderPage";

export function ReaderRoutes() {
  return (
    <Routes>
      {/* URL param :id => ID of the text to read */}
      <Route path=":id" element={<ReaderPage />} />
    </Routes>
  );
}
