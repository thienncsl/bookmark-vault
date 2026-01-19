import { v4 as uuidv4 } from "uuid";
import { type Bookmark, type CreateBookmarkInput } from "./types";
import { bookmarkSchema } from "./validation";

const STORAGE_KEY = "bookmark-vault-data";

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    const result = bookmarkSchema.array().safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    console.error("Failed to read bookmarks from localStorage");
    return [];
  }
}

export function addBookmark(input: CreateBookmarkInput): Bookmark {
  const bookmark: Bookmark = {
    ...input,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };

  try {
    const bookmarks = getBookmarks();
    bookmarks.unshift(bookmark);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    console.error("Failed to save bookmark to localStorage");
  }

  return bookmark;
}

export function deleteBookmark(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    console.error("Failed to delete bookmark from localStorage");
  }
}

export function searchBookmarks(query: string, bookmarks?: Bookmark[]): Bookmark[] {
  const bookmarksToSearch = bookmarks || getBookmarks();
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return bookmarksToSearch;

  const lowerQuery = trimmedQuery.toLowerCase();

  return bookmarksToSearch.filter(
    (b) =>
      b.title.toLowerCase().includes(lowerQuery) ||
      b.url.toLowerCase().includes(lowerQuery) ||
      b.description?.toLowerCase().includes(lowerQuery) ||
      b.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}
