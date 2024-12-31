// src/pages/NewTextPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createText } from "../lib/localStorage";

const supportedLanguages = ["SV", "EN", "DE", "FR", "ES", "JA", "ZH"];

export function NewTextPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sourceLang, setSourceLang] = useState("SV");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Please enter text content!");
      return;
    }
    const newItem = createText(title, content, sourceLang);
    toast.success("Text created successfully!");
    // Optionally navigate to the new text's reading page:
    // navigate(`/reader/${newItem.id}`);
    // Or just navigate back to the library:
    navigate("/library");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create New Text</h1>
      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text font-semibold">Title (optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. My Swedish Article"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Source Language</span>
          </label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="select select-bordered w-full"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Text Content</span>
          </label>
          <textarea
            placeholder="Paste or type your text here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea textarea-bordered w-full h-60"
          />
        </div>

        <div className="flex space-x-2">
          <button type="submit" className="btn btn-primary">
            Create
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/library")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
