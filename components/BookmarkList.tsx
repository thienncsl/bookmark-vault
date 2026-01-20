"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useBookmarksContext } from "@/hooks/useBookmarks";
import { BookmarkCard } from "@/components/BookmarkCard";
import { BookmarkToolbar } from "@/components/BookmarkToolbar";
import { AddBookmarkForm } from "@/components/AddBookmarkForm";
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
  const [showAddForm, setShowAddForm] = useState(false);

  // Dev-only: render counter (useEffect to avoid ref access during render)
  const renderCounter = useRef(0);
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      renderCounter.current++;
      console.log(`[BookmarkList] Render #${renderCounter.current}`);
    }
  });

  const blurActiveElement = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  // Memoize delete handler to provide stable reference to BookmarkCard
  // Without this, each render creates a new function, breaking React.memo
  const handleDelete = useCallback(
    (id: string) => {
      deleteBookmark(id);
    },
    [deleteBookmark]
  );

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
        <p className="text-gray-500 dark:text-gray-400">Loading bookmarks...</p>
      </div>
    );
  }

  const showEmptyState = filteredBookmarks.length === 0 && !searchTerm;
  const showNoResultsMessage = filteredBookmarks.length === 0 && searchTerm;

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      <BookmarkToolbar
        showAddForm={showAddForm}
        onToggleAddForm={() => setShowAddForm(!showAddForm)}
      />

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Add New Bookmark
          </h3>
          <AddBookmarkForm
            onBookmarkAdded={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          ref={searchInputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search bookmarks..."
          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500 sm:text-sm transition-colors"
        />
      </div>

      {showEmptyState && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No bookmarks yet. Add your first one above!
          </p>
        </div>
      )}

      {showNoResultsMessage && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No bookmarks match your search.
          </p>
        </div>
      )}

      {filteredBookmarks.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBookmarks.map((bookmark, index) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={handleDelete}
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
