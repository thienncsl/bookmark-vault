"use client";

import { useCallback } from "react";
import { useBookmarksContext } from "@/hooks/useBookmarks";
import { ExportButton } from "@/components/ExportButton";
import { ImportButton } from "@/components/ImportButton";
import { type Bookmark } from "@/lib/types";

interface BookmarkToolbarProps {
  className?: string;
}

export function BookmarkToolbar({ className = "" }: BookmarkToolbarProps) {
  const { bookmarks, refreshBookmarks } = useBookmarksContext();

  const handleImport = useCallback(
    (importedBookmarks: Bookmark[], mode: "merge" | "replace") => {
      if (mode === "replace") {
        // Replace all bookmarks
        const storageKey = "bookmark-vault-data";
        localStorage.setItem(storageKey, JSON.stringify(importedBookmarks));
      } else {
        // Merge bookmarks - append to existing
        const storageKey = "bookmark-vault-data";
        const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const combined = [...existing, ...importedBookmarks];
        localStorage.setItem(storageKey, JSON.stringify(combined));
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
      <ExportButton bookmarks={bookmarks} />
      <ImportButton onImport={handleImport} existingUrls={bookmarks.map((b) => b.url)} />
    </div>
  );
}
