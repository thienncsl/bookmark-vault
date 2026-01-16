"use client";

import { useState, useEffect } from "react";
import { useBookmarksContext } from "@/hooks/useBookmarks";

export function DevTools() {
  const [showDevTools, setShowDevTools] = useState(false);
  const { simulateError, setSimulateError, error, refreshBookmarks } = useBookmarksContext();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowDevTools(!showDevTools)}
        className="fixed bottom-4 right-4 px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded opacity-50 hover:opacity-100"
        title="Toggle Dev Tools"
      >
        DEV
      </button>

      {showDevTools && (
        <div className="fixed bottom-12 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 min-w-48">
          <h3 className="font-medium text-gray-900 mb-3">Dev Tools</h3>

          <div className="space-y-3">
            <button
              onClick={() => {
                throw new Error("Dev: Test error boundary");
              }}
              className="w-full px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
            >
              Throw Test Error
            </button>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="simulate-error"
                checked={simulateError}
                onChange={(e) => setSimulateError(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="simulate-error"
                className="text-sm text-gray-700 cursor-pointer select-none"
              >
                Simulate Error
              </label>
            </div>

            {error && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={refreshBookmarks}
              className="w-full px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
            >
              Refresh Bookmarks
            </button>
          </div>
        </div>
      )}
    </>
  );
}
