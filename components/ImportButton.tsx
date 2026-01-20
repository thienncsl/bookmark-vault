"use client";

import { useState, useRef, useCallback } from "react";
import { bookmarkSchema } from "@/lib/validation";
import { type Bookmark } from "@/lib/types";

interface ImportButtonProps {
  onImport: (bookmarks: Bookmark[], mode: "merge" | "replace") => void;
  existingUrls?: string[];
  className?: string;
}

interface ImportPreview {
  valid: Bookmark[];
  invalid: { data: unknown; errors: string[] }[];
  duplicates: Bookmark[];
}

export function ImportButton({
  onImport,
  existingUrls = [],
  className = "",
}: ImportButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateBookmarks = useCallback(
    (data: unknown): ImportPreview => {
      const parsed = Array.isArray(data) ? data : [data];

      const valid: Bookmark[] = [];
      const invalid: { data: unknown; errors: string[] }[] = [];
      const duplicates: Bookmark[] = [];

      const urlSet = new Set(existingUrls);

      for (const item of parsed) {
        const result = bookmarkSchema.safeParse(item);

        if (!result.success) {
          const errors = result.error.issues.map((issue) => {
            const path = issue.path.join(".");
            return path ? `${path}: ${issue.message}` : issue.message;
          });
          invalid.push({ data: item, errors });
          continue;
        }

        const bookmark = result.data;

        if (urlSet.has(bookmark.url)) {
          duplicates.push(bookmark);
        } else {
          valid.push(bookmark);
          urlSet.add(bookmark.url);
        }
      }

      return { valid, invalid, duplicates };
    },
    [existingUrls]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) {
        setError(null);
        setPreview(null);
        return;
      }

      if (file.size === 0) {
        setError("File is empty. Please select a valid JSON file.");
        setPreview(null);
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);

          const validationResult = validateBookmarks(parsed);

          if (
            validationResult.valid.length === 0 &&
            validationResult.invalid.length !== 0
          ) {
            setError("No valid bookmarks found in the file.");
            setPreview(null);
            return;
          }

          setError(null);
          setPreview(validationResult);
        } catch {
          setError("Invalid JSON format. Please check the file content.");
          setPreview(null);
        }
      };

      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
        setPreview(null);
      };

      reader.readAsText(file);
    },
    [validateBookmarks]
  );

  const handleImport = useCallback(() => {
    if (!preview) return;

    // Only import valid (non-duplicate) bookmarks
    // Duplicates are shown for info but should not be imported
    if (preview.valid.length === 0) {
      setError("No valid bookmarks to import.");
      return;
    }

    const bookmarksToImport = preview.valid;
    onImport(bookmarksToImport, importMode);

    setSuccess(`Successfully imported ${bookmarksToImport.length} bookmarks.`);
    setShowDialog(false);
    setPreview(null);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  }, [preview, onImport, importMode]);

  const handleClose = useCallback(() => {
    setShowDialog(false);
    setPreview(null);
    setError(null);
    setSuccess(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const openFileDialog = useCallback(() => {
    setShowDialog(true);
    fileInputRef.current?.click();
  }, []);

  const totalValid = preview ? preview.valid.length : 0;

  return (
    <>
      <button
        onClick={openFileDialog}
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
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        Import
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        data-testid="import-input"
        onChange={handleFileChange}
        className="hidden"
      />

      {showDialog && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Import Preview
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-700 dark:text-green-300 text-sm">
                  {success}
                </div>
              )}

              {preview && (
                <>
                  {preview.valid.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Valid Bookmarks ({preview.valid.length})
                      </h4>
                      <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                Title
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                URL
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800/50">
                            {preview.valid.slice(0, 10).map((bookmark, index) => (
                              <tr key={index} className="bg-white dark:bg-transparent">
                                <td className="px-3 py-2 text-sm text-gray-900 dark:text-white truncate max-w-xs">
                                  {bookmark.title}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {bookmark.url}
                                </td>
                              </tr>
                            ))}
                            {preview.valid.length > 10 && (
                              <tr>
                                <td
                                  colSpan={2}
                                  className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center"
                                >
                                  ...and {preview.valid.length - 10} more
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {preview.duplicates.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-2">
                        Duplicate URLs ({preview.duplicates.length})
                      </h4>
                      <div className="max-h-32 overflow-y-auto border border-yellow-200 dark:border-yellow-800/50 rounded bg-yellow-50 dark:bg-yellow-900/20 p-2">
                        {preview.duplicates.map((bookmark, index) => (
                          <div
                            key={index}
                            className="text-sm text-yellow-800 dark:text-yellow-200 truncate"
                          >
                            {bookmark.title} - {bookmark.url}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                        These bookmarks have URLs that already exist and will be
                        skipped during merge.
                      </p>
                    </div>
                  )}

                  {preview.invalid.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                        Validation Errors ({preview.invalid.length})
                      </h4>
                      <div className="max-h-32 overflow-y-auto border border-red-200 dark:border-red-800/50 rounded bg-red-50 dark:bg-red-900/20 p-2">
                        {preview.invalid.slice(0, 5).map((item, index) => (
                          <div
                            key={index}
                            className="text-sm text-red-800 dark:text-red-200 mb-1"
                          >
                            <span className="font-medium">
                              Item {index + 1}:
                            </span>{" "}
                            {item.errors.join(", ")}
                          </div>
                        ))}
                        {preview.invalid.length > 5 && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            ...and {preview.invalid.length - 5} more errors
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Import Mode
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="importMode"
                          value="merge"
                          checked={importMode === "merge"}
                          onChange={() => setImportMode("merge")}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Merge with existing bookmarks
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="importMode"
                          value="replace"
                          checked={importMode === "replace"}
                          onChange={() => setImportMode("replace")}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Replace all existing bookmarks
                        </span>
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              {preview && totalValid > 0 && (
                <button
                  onClick={handleImport}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Import {totalValid} bookmark{totalValid !== 1 ? "s" : ""}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
