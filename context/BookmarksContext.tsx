"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  getBookmarks,
  addBookmark as storageAddBookmark,
  deleteBookmark as storageDeleteBookmark,
  searchBookmarks as storageSearchBookmarks,
} from "@/lib/storage";
import { type Bookmark, type CreateBookmarkInput } from "@/lib/types";

interface BookmarksContextType {
  bookmarks: Bookmark[];
  filteredBookmarks: Bookmark[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addBookmark: (input: CreateBookmarkInput) => Bookmark;
  deleteBookmark: (id: string) => void;
  refreshBookmarks: () => void;
}

const BookmarksContext = createContext<BookmarksContextType | null>(null);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const refreshBookmarks = useCallback(() => {
    setBookmarks(getBookmarks());
  }, []);

  useEffect(() => {
    refreshBookmarks();
    setLoading(false);
  }, [refreshBookmarks]);

  const filteredBookmarks = debouncedSearch.trim()
    ? storageSearchBookmarks(debouncedSearch)
    : bookmarks;

  const addBookmark = useCallback((input: CreateBookmarkInput): Bookmark => {
    const bookmark = storageAddBookmark(input);
    setBookmarks((prev) => [bookmark, ...prev]);
    return bookmark;
  }, []);

  const deleteBookmark = useCallback((id: string) => {
    storageDeleteBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        filteredBookmarks,
        loading,
        searchTerm,
        setSearchTerm,
        addBookmark,
        deleteBookmark,
        refreshBookmarks,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarksContext() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarksContext must be used within a BookmarksProvider");
  }
  return context;
}
