"use client";

import { useCallback } from "react";
import { type Bookmark } from "@/lib/types";

interface ExportButtonProps {
  bookmarks: Bookmark[];
  label?: string;
  className?: string;
}

export function ExportButton({
  bookmarks,
  label = "Export",
  className = "",
}: ExportButtonProps) {
  const handleExport = useCallback(() => {
    const date = new Date().toISOString().split("T")[0];
    const filename = `bookmarks-${date}.json`;

    const data = JSON.stringify(bookmarks, null, 2);
    const blob = new Blob([data], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, [bookmarks]);

  return (
    <button
      onClick={handleExport}
      className={`inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors ${className}`}
    >
      <svg
        className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      {label}
    </button>
  );
}
