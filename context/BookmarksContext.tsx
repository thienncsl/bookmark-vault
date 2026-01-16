"use client";

import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  getBookmarks,
  addBookmark as storageAddBookmark,
  deleteBookmark as storageDeleteBookmark,
  searchBookmarks as storageSearchBookmarks,
} from "@/lib/storage";
import { type Bookmark, type CreateBookmarkInput } from "@/lib/types";

// Action types
export type BookmarksAction =
  | { type: "ADD_BOOKMARK"; payload: Bookmark }
  | { type: "ADD_BOOKMARK_SUCCESS"; payload: { id: string } }
  | { type: "ADD_BOOKMARK_ERROR"; payload: { id: string; error: string } }
  | { type: "DELETE_BOOKMARK"; payload: { id: string } }
  | { type: "DELETE_BOOKMARK_SUCCESS"; payload: { id: string } }
  | { type: "DELETE_BOOKMARK_ERROR"; payload: { id: string; error: string } }
  | { type: "SET_BOOKMARKS"; payload: Bookmark[] }
  | { type: "CLEAR_ERROR" };

// State shape
interface BookmarksState {
  bookmarks: Bookmark[];
  pendingAdds: Set<string>;
  pendingDeletes: Set<string>;
  error: string | null;
  simulateError: boolean;
}

interface BookmarksContextType {
  bookmarks: Bookmark[];
  filteredBookmarks: Bookmark[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addBookmark: (input: CreateBookmarkInput) => void;
  deleteBookmark: (id: string) => void;
  error: string | null;
  simulateError: boolean;
  setSimulateError: (value: boolean) => void;
  refreshBookmarks: () => void;
  pendingAdds: Set<string>;
  pendingDeletes: Set<string>;
}

const initialState: BookmarksState = {
  bookmarks: [],
  pendingAdds: new Set(),
  pendingDeletes: new Set(),
  error: null,
  simulateError: false,
};

function bookmarksReducer(state: BookmarksState, action: BookmarksAction): BookmarksState {
  switch (action.type) {
    case "SET_BOOKMARKS": {
      return {
        ...state,
        bookmarks: action.payload,
        pendingAdds: new Set(),
        pendingDeletes: new Set(),
        error: null,
      };
    }

    case "ADD_BOOKMARK": {
      const newPendingAdds = new Set(state.pendingAdds);
      newPendingAdds.add(action.payload.id);
      return {
        ...state,
        bookmarks: [action.payload, ...state.bookmarks],
        pendingAdds: newPendingAdds,
        error: null,
      };
    }

    case "ADD_BOOKMARK_SUCCESS": {
      const newPendingAdds = new Set(state.pendingAdds);
      newPendingAdds.delete(action.payload.id);
      return {
        ...state,
        pendingAdds: newPendingAdds,
        error: null,
      };
    }

    case "ADD_BOOKMARK_ERROR": {
      const newPendingAdds = new Set(state.pendingAdds);
      newPendingAdds.delete(action.payload.id);
      return {
        ...state,
        bookmarks: state.bookmarks.filter((b) => b.id !== action.payload.id),
        pendingAdds: newPendingAdds,
        error: action.payload.error,
      };
    }

    case "DELETE_BOOKMARK": {
      const newPendingDeletes = new Set(state.pendingDeletes);
      newPendingDeletes.add(action.payload.id);
      return {
        ...state,
        pendingDeletes: newPendingDeletes,
        error: null,
      };
    }

    case "DELETE_BOOKMARK_SUCCESS": {
      const newPendingDeletes = new Set(state.pendingDeletes);
      newPendingDeletes.delete(action.payload.id);
      return {
        ...state,
        bookmarks: state.bookmarks.filter((b) => b.id !== action.payload.id),
        pendingDeletes: newPendingDeletes,
        error: null,
      };
    }

    case "DELETE_BOOKMARK_ERROR": {
      const newPendingDeletes = new Set(state.pendingDeletes);
      newPendingDeletes.delete(action.payload.id);
      return {
        ...state,
        pendingDeletes: newPendingDeletes,
        error: action.payload.error,
      };
    }

    case "CLEAR_ERROR": {
      return {
        ...state,
        error: null,
      };
    }

    default:
      return state;
  }
}

const BookmarksContext = createContext<BookmarksContextType | null>(null);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookmarksReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Initialize bookmarks from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(true);
      const loaded = getBookmarks();
      dispatch({ type: "SET_BOOKMARKS", payload: loaded });
      setLoading(false);
    }
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const refreshBookmarks = useCallback(() => {
    if (typeof window !== "undefined") {
      const loaded = getBookmarks();
      dispatch({ type: "SET_BOOKMARKS", payload: loaded });
    }
  }, []);

  // Simulated async add bookmark with optimistic update
  const addBookmark = useCallback((input: CreateBookmarkInput) => {
    const id = uuidv4();
    const newBookmark: Bookmark = {
      ...input,
      id,
      createdAt: new Date().toISOString(),
    };

    // Optimistic: immediately add to state
    dispatch({ type: "ADD_BOOKMARK", payload: newBookmark });

    // Simulate async operation
    setTimeout(() => {
      if (state.simulateError) {
        dispatch({
          type: "ADD_BOOKMARK_ERROR",
          payload: { id, error: "Simulated error: Failed to save bookmark" },
        });
        return;
      }

      try {
        storageAddBookmark(input);
        dispatch({ type: "ADD_BOOKMARK_SUCCESS", payload: { id } });
      } catch (error) {
        dispatch({
          type: "ADD_BOOKMARK_ERROR",
          payload: { id, error: error instanceof Error ? error.message : "Failed to add bookmark" },
        });
      }
    }, 0);
  }, [state.simulateError]);

  // Simulated async delete bookmark with optimistic update
  const deleteBookmark = useCallback((id: string) => {
    // Optimistic: mark as pending delete
    dispatch({ type: "DELETE_BOOKMARK", payload: { id } });

    // Simulate async operation
    setTimeout(() => {
      if (state.simulateError) {
        dispatch({
          type: "DELETE_BOOKMARK_ERROR",
          payload: { id, error: "Simulated error: Failed to delete bookmark" },
        });
        return;
      }

      try {
        storageDeleteBookmark(id);
        dispatch({ type: "DELETE_BOOKMARK_SUCCESS", payload: { id } });
      } catch (error) {
        dispatch({
          type: "DELETE_BOOKMARK_ERROR",
          payload: { id, error: error instanceof Error ? error.message : "Failed to delete bookmark" },
        });
      }
    }, 0);
  }, [state.simulateError]);

  const filteredBookmarks = debouncedSearch.trim()
    ? storageSearchBookmarks(debouncedSearch, state.bookmarks)
    : state.bookmarks;

  const setSimulateError = useCallback((value: boolean) => {
    dispatch({ type: "CLEAR_ERROR" });
    // We need to store this in a ref or separate state since reducer should be pure
    // But for simplicity, we'll use a module-level variable for dev mode
    if (typeof window !== "undefined") {
      (window as unknown as { __SIMULATE_ERROR__: boolean }).__SIMULATE_ERROR__ = value;
    }
  }, []);

  // Read simulate error from window (dev only)
  const simulateError = typeof window !== "undefined"
    ? (window as unknown as { __SIMULATE_ERROR__: boolean }).__SIMULATE_ERROR__
    : false;

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks: state.bookmarks,
        filteredBookmarks,
        loading,
        searchTerm,
        setSearchTerm,
        addBookmark,
        deleteBookmark,
        error: state.error,
        simulateError,
        setSimulateError,
        refreshBookmarks,
        pendingAdds: state.pendingAdds,
        pendingDeletes: state.pendingDeletes,
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
