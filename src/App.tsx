// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";

// Route configs
import { ReaderRoutes } from "./routes/ReaderRoutes";
import { FlashcardRoutes } from "./routes/FlashcardRoutes";
import { LibraryRoutes } from "./routes/LibraryRoutes";

/**
 * Top-level layout container: 
 * - A <Navbar/>
 * - <Routes/>
 * - A <Footer/>
 */
export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* Home => redirect to library */}
          <Route path="/" element={<Navigate to="/library" replace />} />

          {/* Library management */}
          <Route path="/library/*" element={<LibraryRoutes />} />

          {/* Reading page */}
          <Route path="/reader/*" element={<ReaderRoutes />} />

          {/* Flashcards */}
          <Route path="/flashcards/*" element={<FlashcardRoutes />} />

          {/* 404 fallback */}
          <Route path="*" element={<h1 className="p-4 text-center text-red-500">Page not found</h1>} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
