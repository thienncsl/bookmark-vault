"use client";

import { useBookmarksContext } from "@/hooks/useBookmarks";
import { BookmarkCard } from "@/components/BookmarkCard";

export function BookmarkList() {
  const { filteredBookmarks, loading, searchTerm, setSearchTerm, deleteBookmark } =
    useBookmarksContext();

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search bookmarks..."
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={deleteBookmark}
          />
        ))}
      </div>
    </div>
  );
}
