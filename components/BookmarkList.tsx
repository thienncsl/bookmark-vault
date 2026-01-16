"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useBookmarksContext } from "@/hooks/useBookmarks";
import { BookmarkCard } from "@/components/BookmarkCard";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export function BookmarkList() {
  const {
    filteredBookmarks,
    loading,
    searchTerm,
    setSearchTerm,
    deleteBookmark,
    pendingAdds,
    pendingDeletes,
    error,
  } = useBookmarksContext();
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

  const showEmptyState = filteredBookmarks.length === 0 && !searchTerm;
  const showNoResultsMessage = filteredBookmarks.length === 0 && searchTerm;

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

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

      {showEmptyState && (
        <div className="text-center py-12">
          <p className="text-gray-500">No bookmarks yet. Add your first one above!</p>
        </div>
      )}

      {showNoResultsMessage && (
        <div className="text-center py-12">
          <p className="text-gray-500">No bookmarks match your search.</p>
        </div>
      )}

      {filteredBookmarks.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBookmarks.map((bookmark, index) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={deleteBookmark}
              isFocused={index === focusedIndex}
              tabIndex={0}
              dataBookmarkCard=""
              isPendingAdd={pendingAdds.has(bookmark.id)}
              isPendingDelete={pendingDeletes.has(bookmark.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
