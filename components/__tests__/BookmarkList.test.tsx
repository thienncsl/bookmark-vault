import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookmarkList } from "../BookmarkList";
import type { Bookmark } from "@/lib/types";

// Mock the useBookmarksContext hook
jest.mock("@/hooks/useBookmarks", () => ({
  useBookmarksContext: jest.fn(),
}));

// Mock useKeyboardShortcuts to avoid event listener issues
jest.mock("@/hooks/useKeyboardShortcuts", () => ({
  useKeyboardShortcuts: jest.fn(),
}));

describe("BookmarkList", () => {
  const mockBookmarks: Bookmark[] = [
    {
      id: "1",
      title: "First Bookmark",
      url: "https://first.com",
      description: "First description",
      tags: ["tag1"],
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      title: "Second Bookmark",
      url: "https://second.com",
      description: "Second description",
      tags: ["tag2"],
      createdAt: "2024-01-02T00:00:00.000Z",
    },
    {
      id: "3",
      title: "Third Bookmark",
      url: "https://third.com",
      description: "Third description",
      tags: ["tag3"],
      createdAt: "2024-01-03T00:00:00.000Z",
    },
  ];

  const mockFilteredBookmarks = mockBookmarks;
  const mockDeleteBookmark = jest.fn();
  const mockSetSearchTerm = jest.fn();

  const defaultMockContext = {
    filteredBookmarks: mockFilteredBookmarks,
    loading: false,
    searchTerm: "",
    setSearchTerm: mockSetSearchTerm,
    deleteBookmark: mockDeleteBookmark,
    pendingAdds: new Set<string>(),
    pendingDeletes: new Set<string>(),
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.doMock("@/hooks/useBookmarks", () => ({
      useBookmarksContext: jest.fn(() => defaultMockContext),
    }));
  });

  it("shows loading state when loading is true", () => {
    jest.doMock("@/hooks/useBookmarks", () => ({
      useBookmarksContext: jest.fn(() => ({
        ...defaultMockContext,
        loading: true,
      })),
    }));

    // Need to re-import with fresh mock
    const { BookmarkList: FreshBookmarkList } = require("../BookmarkList");
    render(<FreshBookmarkList />);

    expect(screen.getByText(/loading bookmarks/i)).toBeInTheDocument();
  });

  it("shows 'No bookmarks' empty state when bookmarks is empty and no search term", () => {
    jest.doMock("@/hooks/useBookmarks", () => ({
      useBookmarksContext: jest.fn(() => ({
        ...defaultMockContext,
        filteredBookmarks: [],
        searchTerm: "",
      })),
    }));

    const { BookmarkList: FreshBookmarkList } = require("../BookmarkList");
    render(<FreshBookmarkList />);

    expect(screen.getByText(/no bookmarks yet/i)).toBeInTheDocument();
    expect(screen.getByText(/add your first one above/i)).toBeInTheDocument();
  });

  it("shows 'no results' message when search has no matches", () => {
    jest.doMock("@/hooks/useBookmarks", () => ({
      useBookmarksContext: jest.fn(() => ({
        ...defaultMockContext,
        filteredBookmarks: [],
        searchTerm: "nonexistent",
      })),
    }));

    const { BookmarkList: FreshBookmarkList } = require("../BookmarkList");
    render(<FreshBookmarkList />);

    expect(screen.getByText(/no bookmarks match your search/i)).toBeInTheDocument();
  });

  it("renders correct number of BookmarkCard components", () => {
    render(<BookmarkList />);

    const cards = screen.getAllByTestId("bookmark-card");
    expect(cards).toHaveLength(3);
  });

  it("renders BookmarkCard for each bookmark", () => {
    render(<BookmarkList />);

    expect(screen.getByText("First Bookmark")).toBeInTheDocument();
    expect(screen.getByText("Second Bookmark")).toBeInTheDocument();
    expect(screen.getByText("Third Bookmark")).toBeInTheDocument();
  });

  it("search input filters displayed bookmarks", async () => {
    jest.doMock("@/hooks/useBookmarks", () => ({
      useBookmarksContext: jest.fn(() => ({
        ...defaultMockContext,
        filteredBookmarks: [mockBookmarks[0]],
        searchTerm: "First",
      })),
    }));

    const { BookmarkList: FreshBookmarkList } = require("../BookmarkList");
    render(<FreshBookmarkList />);

    expect(screen.getByText("First Bookmark")).toBeInTheDocument();
    expect(screen.queryByText("Second Bookmark")).not.toBeInTheDocument();
    expect(screen.queryByText("Third Bookmark")).not.toBeInTheDocument();
  });

  it("search input calls setSearchTerm on change", async () => {
    const user = userEvent.setup();
    render(<BookmarkList />);

    const searchInput = screen.getByPlaceholderText(/search bookmarks/i);
    await user.type(searchInput, "test");

    expect(mockSetSearchTerm).toHaveBeenCalledWith("test");
  });

  it("search input has correct placeholder", () => {
    render(<BookmarkList />);

    expect(screen.getByPlaceholderText(/search bookmarks/i)).toBeInTheDocument();
  });

  it("displays error message when error is present", () => {
    jest.doMock("@/hooks/useBookmarks", () => ({
      useBookmarksContext: jest.fn(() => ({
        ...defaultMockContext,
        error: "Test error message",
      })),
    }));

    const { BookmarkList: FreshBookmarkList } = require("../BookmarkList");
    render(<FreshBookmarkList />);

    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("renders export and import buttons in toolbar", () => {
    render(<BookmarkList />);

    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /import/i })).toBeInTheDocument();
  });
});
