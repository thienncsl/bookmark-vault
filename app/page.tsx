"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorFallback } from "@/components/ErrorFallback";
import { AddBookmarkForm } from "@/components/AddBookmarkForm";
import { BookmarkList } from "@/components/BookmarkList";

export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Bookmark</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AddBookmarkForm />
          </ErrorBoundary>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Bookmarks</h2>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <BookmarkList />
        </ErrorBoundary>
      </section>
    </div>
  );
}
