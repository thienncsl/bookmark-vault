import { memo, useMemo, useRef, useEffect, useState } from "react";
import { type Bookmark } from "@/lib/types";
import { BookmarkModal } from "@/components/BookmarkModal";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  isFocused?: boolean;
  tabIndex?: number;
  dataBookmarkCard?: string;
  isPendingAdd?: boolean;
  isPendingDelete?: boolean;
}

// Memoized BookmarkCard - only re-renders when props actually change
// This prevents unnecessary re-renders when parent (BookmarkList) re-renders
export const BookmarkCard = memo(function BookmarkCard({
  bookmark,
  onDelete,
  isFocused = false,
  tabIndex,
  dataBookmarkCard,
  isPendingAdd = false,
  isPendingDelete = false,
}: BookmarkCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  // Dev-only: per-card render counter (useEffect to avoid ref access during render)
  const renderCounter = useRef(0);
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      renderCounter.current++;
      console.log(
        `[BookmarkCard] "${bookmark.title}" - Render #${renderCounter.current}`
      );
    }
  });

  // Memoize derived state to avoid recalculation on each render
  const isPending = useMemo(
    () => isPendingAdd || isPendingDelete,
    [isPendingAdd, isPendingDelete]
  );

  // Memoize delete handler to return stable reference
  const handleDelete = useMemo(
    () => () => onDelete(bookmark.id),
    [onDelete, bookmark.id]
  );

  return (
    <>
      <div
        data-testid="bookmark-card"
        className={`rounded-lg border p-4 shadow-sm transition-all relative ${
          isFocused
            ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md dark:hover:shadow-lg"
        } ${isPending ? "opacity-50" : ""}`}
        tabIndex={tabIndex}
        data-bookmark-card={dataBookmarkCard}
      >
        {isPendingAdd && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200">
              Saving...
            </span>
          </div>
        )}

        {isPendingDelete && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200">
              Deleting...
            </span>
          </div>
        )}

        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1 pr-8">
            {bookmark.title}
          </h3>
          <div className="absolute top-4 right-4 flex items-center gap-1">
            <button
              onClick={() => setShowEditModal(true)}
              disabled={isPending}
              className={`p-1.5 rounded transition-colors ${
                isPending
                  ? "opacity-30 cursor-not-allowed"
                  : "text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title="Edit bookmark"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className={`p-1.5 rounded transition-colors ${
                isPending
                  ? "opacity-30 cursor-not-allowed"
                  : "text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title="Delete bookmark"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline line-clamp-1 mb-2 block"
        >
          {bookmark.url}
        </a>

        {bookmark.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {bookmark.description}
          </p>
        )}

        {bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {bookmark.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <BookmarkModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        bookmark={bookmark}
      />
    </>
  );
});
