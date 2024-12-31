// src/pages/TextLibrary.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadTexts, deleteText, SavedText } from "../lib/localStorage";
import toast from "react-hot-toast";

/**
 * This page lists out all the user's texts in localStorage,
 * letting them click to "Read" or "Delete" them.
 */
export function TextLibrary() {
  const navigate = useNavigate();
  const [texts, setTexts] = useState<SavedText[]>([]);

  useEffect(() => {
    // Load from localStorage once on mount
    setTexts(loadTexts());
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this text?")) {
      return;
    }
    deleteText(id);
    const updated = loadTexts();
    setTexts(updated);
    toast.success("Text deleted successfully");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Text Library</h1>
        <button
          onClick={() => navigate("/library/new")}
          className="btn btn-primary"
        >
          New Text
        </button>
      </div>

      {texts.length === 0 ? (
        <p className="text-gray-500">No texts found. Create a new one!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Language</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {texts.map((text) => (
                <tr key={text.id}>
                  <td>{text.title}</td>
                  <td>{text.sourceLang}</td>
                  <td>{new Date(text.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="flex space-x-2">
                      <Link
                        to={`/reader/${text.id}`}
                        className="btn btn-sm btn-info"
                      >
                        Read
                      </Link>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(text.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
