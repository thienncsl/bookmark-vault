"use client";

import { useState } from "react";

export function DevTools() {
  const [showDevTools, setShowDevTools] = useState(false);

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
        <div className="fixed bottom-12 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
          <h3 className="font-medium text-gray-900 mb-3">Dev Tools</h3>
          <button
            onClick={() => {
              throw new Error("Dev: Test error boundary");
            }}
            className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
          >
            Throw Test Error
          </button>
        </div>
      )}
    </>
  );
}
