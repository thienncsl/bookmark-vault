"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useBookmarksContext } from "@/hooks/useBookmarks";
import { BookmarkCard } from "@/components/BookmarkCard";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export function BookmarkList() {
  const { filteredBookmarks, loading, searchTerm, setSearchTerm, deleteBookmark } =
    useBookmarksContext();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const blurActiveElement = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < filteredBookmarks.length) {
      const cards = document.querySelectorAll("[data-bookmark-card]");
      const card = cards[focusedIndex] as HTMLElement;
      if (card) {
        card.focus();
      }
    }
  }, [focusedIndex, filteredBookmarks.length]);

  useKeyboardShortcuts({
    titleInputRef: { current: null },
    searchInputRef,
    onClearForm: () => {},
    onSetFocusedIndex: setFocusedIndex,
    onBlurActiveElement: blurActiveElement,
    bookmarkCount: filteredBookmarks.length,
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading bookmarks...</p>
      </div>
    );
  }

  if (filteredBookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {searchTerm
            ? "No bookmarks match your search."
            : "No bookmarks yet. Add your first one above!"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          ref={searchInputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search bookmarks..."
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBookmarks.map((bookmark, index) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={deleteBookmark}
            isFocused={index === focusedIndex}
            tabIndex={0}
            dataBookmarkCard=""
          />
        ))}
      </div>
    </div>
  );
}
