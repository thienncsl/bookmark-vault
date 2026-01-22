"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useBookmarksContext } from "@/hooks/useBookmarks";
import { bookmarkInputSchema } from "@/lib/validation";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { type Bookmark, type CreateBookmarkInput, type UpdateBookmarkInput } from "@/lib/types";

interface FormData {
  title: string;
  url: string;
  description: string;
  tags: string;
}

interface FormErrors {
  title?: string;
  url?: string;
  description?: string;
  tags?: string;
  [key: string]: string | undefined;
}

interface AddBookmarkFormProps {
  bookmark?: Bookmark | null;
  onBookmarkAdded?: () => void;
  onBookmarkUpdated?: () => void;
  onClose?: () => void;
}

export function AddBookmarkForm({
  bookmark,
  onBookmarkAdded,
  onBookmarkUpdated,
  onClose,
}: AddBookmarkFormProps) {
  const { addBookmark, updateBookmark, bookmarks } = useBookmarksContext();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!bookmark;

  const [formData, setFormData] = useState<FormData>({
    title: "",
    url: "",
    description: "",
    tags: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize form with bookmark data when editing
  useEffect(() => {
    if (bookmark) {
      setFormData({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description || "",
        tags: bookmark.tags.join(", "),
      });
    }
  }, [bookmark]);

  const clearForm = useCallback(() => {
    setFormData({ title: "", url: "", description: "", tags: "" });
    setErrors({});
  }, []);

  const blurActiveElement = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  useKeyboardShortcuts({
    titleInputRef,
    searchInputRef: { current: null },
    onClearForm: clearForm,
    onSetFocusedIndex: () => {},
    onBlurActiveElement: blurActiveElement,
    bookmarkCount: 0,
  });

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const result = bookmarkInputSchema.safeParse({
      ...formData,
      tags: tagsArray,
    });

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((err) => {
        const path = err.path[0];
        if (typeof path === "string") {
          fieldErrors[path] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Check for duplicate URL (exclude current bookmark when editing)
    const normalizedUrl = formData.url.toLowerCase().trim();
    const isDuplicate = bookmarks.some(
      (b) => b.url.toLowerCase().trim() === normalizedUrl && b.id !== bookmark?.id
    );

    if (isDuplicate) {
      setErrors({ url: "A bookmark with this URL already exists" });
      setIsSubmitting(false);
      return;
    }

    if (isEditing && bookmark) {
      // Update existing bookmark
      const updateInput: UpdateBookmarkInput = {
        title: formData.title,
        url: formData.url,
        description: formData.description || undefined,
        tags: tagsArray,
      };

      await updateBookmark(bookmark.id, updateInput);
      setSuccess(true);
      setIsSubmitting(false);
      onBookmarkUpdated?.();
      onClose?.();
    } else {
      // Add new bookmark
      const createInput: CreateBookmarkInput = {
        title: formData.title,
        url: formData.url,
        description: formData.description || undefined,
        tags: tagsArray,
      };

      await addBookmark(createInput);
      setFormData({ title: "", url: "", description: "", tags: "" });
      setIsSubmitting(false);
      setSuccess(true);
      onBookmarkAdded?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          ref={titleInputRef}
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500 sm:text-sm transition-colors"
          placeholder="My Bookmark"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          URL
        </label>
        <input
          type="url"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500 sm:text-sm transition-colors"
          placeholder="https://example.com"
        />
        {errors.url && (
          <p data-testid="url-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.url}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500 sm:text-sm transition-colors"
          placeholder="Optional description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500 sm:text-sm transition-colors"
          placeholder="tag1, tag2, tag3"
        />
        {errors.tags && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.tags}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        {isEditing && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${
            isEditing ? "flex-1" : "w-full"
          } rounded-md bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Bookmark"
            : "Add Bookmark"}
        </button>
      </div>

      {success && (
        <p className="text-sm text-green-600 dark:text-green-400 text-center">
          {isEditing
            ? "Bookmark updated successfully!"
            : "Bookmark added successfully!"}
        </p>
      )}
    </form>
  );
}
