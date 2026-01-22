"use client";

import { useCallback } from "react";
import { useBookmarksContext } from "@/hooks/useBookmarks";
import { ExportButton } from "@/components/ExportButton";
import { ImportButton } from "@/components/ImportButton";
import { type Bookmark } from "@/lib/types";

interface BookmarkToolbarProps {
  showAddForm: boolean;
  onToggleAddForm: () => void;
  className?: string;
}

export function BookmarkToolbar({
  showAddForm,
  onToggleAddForm,
  className = "",
}: BookmarkToolbarProps) {
  const { bookmarks, refreshBookmarks } = useBookmarksContext();

  const handleImport = useCallback(
    (importedBookmarks: Bookmark[], mode: "merge" | "replace") => {
      if (typeof window === "undefined") return;

      try {
        const storageKey = "bookmark-vault-data";
        if (mode === "replace") {
          localStorage.setItem(storageKey, JSON.stringify(importedBookmarks));
        } else {
          // Merge bookmarks - append to existing
          let existing: Bookmark[] = [];
          try {
            const existingData = localStorage.getItem(storageKey);
            if (existingData) {
              existing = JSON.parse(existingData);
            }
          } catch {
            console.error("Failed to parse existing bookmarks");
            existing = [];
          }
          const combined = [...existing, ...importedBookmarks];
          localStorage.setItem(storageKey, JSON.stringify(combined));
        }
      } catch {
        console.error("Failed to save imported bookmarks to localStorage");
      }

      refreshBookmarks();
    },
    [refreshBookmarks]
  );

  return (
    <div
      className={`flex flex-wrap items-center gap-3 mb-6 ${className}`}
      role="toolbar"
      aria-label="Bookmark management toolbar"
    >
      <button
        onClick={onToggleAddForm}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors shadow-sm"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={showAddForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"}
          />
        </svg>
        {showAddForm ? "Cancel" : "Add bookmark"}
      </button>
      <div className="flex items-center gap-3">
        <ExportButton bookmarks={bookmarks} />
        <ImportButton
          onImport={handleImport}
          existingUrls={bookmarks.map((b) => b.url)}
        />
      </div>
    </div>
  );
}
