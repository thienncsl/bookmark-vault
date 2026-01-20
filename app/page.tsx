"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorFallback } from "@/components/ErrorFallback";
import { BookmarkList } from "@/components/BookmarkList";

export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Your Bookmarks
        </h2>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <BookmarkList />
        </ErrorBoundary>
      </section>
    </div>
  );
}
