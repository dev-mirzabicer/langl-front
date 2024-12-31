// src/components/common/Navbar.tsx
import React from "react";
import { Link, NavLink } from "react-router-dom";

export function Navbar() {
  return (
    <div className="navbar bg-primary text-primary-content px-4">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold">
          My Language Learner
        </Link>
      </div>
      <div className="flex-none space-x-2">
        <NavLink
          to="/library"
          className={({ isActive }) =>
            `btn btn-ghost ${isActive ? "btn-active" : ""}`
          }
        >
          Library
        </NavLink>
        <NavLink
          to="/flashcards/list"
          className={({ isActive }) =>
            `btn btn-ghost ${isActive ? "btn-active" : ""}`
          }
        >
          Flashcards
        </NavLink>
        <NavLink
          to="/flashcards/study"
          className={({ isActive }) =>
            `btn btn-ghost ${isActive ? "btn-active" : ""}`
          }
        >
          Study
        </NavLink>
      </div>
    </div>
  );
}
