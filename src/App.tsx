// src/App.tsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ReaderContainer } from "./components/ReaderContainer";
import { FlashcardPage } from "./components/FlashcardPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-blue-600 text-white p-4 shadow flex items-center">
        <h1 className="text-xl font-bold mr-4">My Language Learning App</h1>
        <Link to="/reader" className="mr-4 underline">
          Reader
        </Link>
        <Link to="/flashcards" className="underline">
          Flashcards
        </Link>
      </header>

      <main className="flex-1 p-4">
        <Routes>
          <Route path="/reader" element={<ReaderContainer />} />
          <Route path="/flashcards/*" element={<FlashcardPage />} />
          <Route path="/" element={<ReaderContainer />} />
        </Routes>
      </main>
    </div>
  );
}
