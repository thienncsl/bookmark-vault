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
            validationResult.invalid.length === 0
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

    if (preview.valid.length === 0 && preview.duplicates.length === 0) {
      setError("No valid bookmarks to import.");
      return;
    }

    const bookmarksToImport = [...preview.valid, ...preview.duplicates];
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

  const totalValid = preview
    ? preview.valid.length + preview.duplicates.length
    : 0;

  return (
    <>
      <button
        onClick={openFileDialog}
        className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      >
        <svg
          className="w-4 h-4 mr-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Import Preview</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
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
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                  {success}
                </div>
              )}

              {preview && (
                <>
                  {preview.valid.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Valid Bookmarks ({preview.valid.length})
                      </h4>
                      <div className="max-h-48 overflow-y-auto border rounded">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Title
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                URL
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {preview.valid.slice(0, 10).map((bookmark, index) => (
                              <tr key={index} className="bg-white">
                                <td className="px-3 py-2 text-sm text-gray-900 truncate max-w-xs">
                                  {bookmark.title}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-500 truncate max-w-xs">
                                  {bookmark.url}
                                </td>
                              </tr>
                            ))}
                            {preview.valid.length > 10 && (
                              <tr>
                                <td
                                  colSpan={2}
                                  className="px-3 py-2 text-sm text-gray-500 text-center"
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
                      <h4 className="text-sm font-medium text-yellow-700 mb-2">
                        Duplicate URLs ({preview.duplicates.length})
                      </h4>
                      <div className="max-h-32 overflow-y-auto border border-yellow-200 rounded bg-yellow-50 p-2">
                        {preview.duplicates.map((bookmark, index) => (
                          <div
                            key={index}
                            className="text-sm text-yellow-800 truncate"
                          >
                            {bookmark.title} - {bookmark.url}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-yellow-600 mt-1">
                        These bookmarks have URLs that already exist and will be
                        skipped during merge.
                      </p>
                    </div>
                  )}

                  {preview.invalid.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-red-700 mb-2">
                        Validation Errors ({preview.invalid.length})
                      </h4>
                      <div className="max-h-32 overflow-y-auto border border-red-200 rounded bg-red-50 p-2">
                        {preview.invalid.slice(0, 5).map((item, index) => (
                          <div key={index} className="text-sm text-red-800 mb-1">
                            <span className="font-medium">
                              Item {index + 1}:
                            </span>{" "}
                            {item.errors.join(", ")}
                          </div>
                        ))}
                        {preview.invalid.length > 5 && (
                          <p className="text-xs text-red-600 mt-1">
                            ...and {preview.invalid.length - 5} more errors
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
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
                        <span className="text-sm text-gray-700">
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
                        <span className="text-sm text-gray-700">
                          Replace all existing bookmarks
                        </span>
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              {preview && totalValid > 0 && (
                <button
                  onClick={handleImport}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
