// src/pages/ReaderPage.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getTextById } from "../lib/localStorage";
import { TranslationResponse } from "../types/translation";
import { ReaderContainer } from "../components/Reader/ReaderContainer";

/**
 * The ReaderPage uses the URL param :id to find the text in localStorage,
 * calls /api/translation with the text content, and displays the result.
 */
export function ReaderPage() {
  const { id } = useParams();        // the text ID from the route
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [translationData, setTranslationData] = useState<TranslationResponse | null>(null);

  useEffect(() => {
    if (!id) {
      toast.error("No text ID provided");
      navigate("/library");
      return;
    }
    const textItem = getTextById(id);
    if (!textItem) {
      toast.error("Text not found!");
      navigate("/library");
      return;
    }
    // We have a valid text. Let's request the translation from the backend.
    fetchTranslation(textItem.content, textItem.sourceLang);
  }, [id]);

  /**
   * Calls our backend translation endpoint.
   * The endpoint is: POST /api/translation, with JSON body:
   * {
   *   "text": "...",
   *   "sourceLanguage": "SV",
   *   "targetLanguage": "EN",
   *   "splitSentences": true,
   *   "markWords": true
   * }
   */
  async function fetchTranslation(content: string, sourceLang: string) {
    try {
      setLoading(true);

      // You can choose a default targetLanguage. Let’s say "EN".
      // In a more dynamic UI, you might let the user pick the target here as well.
      const targetLang = "EN";

      const resp = await fetch("http://127.0.0.1:5000/api/translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: content,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          splitSentences: true,
          markWords: true,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || `Translation request failed: ${resp.statusText}`);
      }

      const data: TranslationResponse = await resp.json();
      setTranslationData(data);
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to fetch translation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Render
  if (loading) {
    return <div className="p-4">Loading translation...</div>;
  }

  if (!translationData) {
    return <div className="p-4 text-red-600">No translation data available.</div>;
  }

  return (
    <div className="p-4">
      <ReaderContainer translationData={translationData} />
    </div>
  );
}
