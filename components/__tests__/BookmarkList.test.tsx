import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookmarkList } from "../BookmarkList";
import type { Bookmark } from "@/lib/types";

// Create mock functions at module level
const mockSetSearchTerm = jest.fn();
const mockDeleteBookmark = jest.fn();

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

// Create a function that returns the mock context
const createMockContext = (overrides: Partial<{
  bookmarks: Bookmark[];
  filteredBookmarks: Bookmark[];
  loading: boolean;
  searchTerm: string;
  error: string | null;
}> = {}) => ({
  bookmarks: overrides.bookmarks ?? mockBookmarks,
  filteredBookmarks: overrides.filteredBookmarks ?? mockBookmarks,
  loading: overrides.loading ?? false,
  searchTerm: overrides.searchTerm ?? "",
  setSearchTerm: mockSetSearchTerm,
  deleteBookmark: mockDeleteBookmark,
  pendingAdds: new Set<string>(),
  pendingDeletes: new Set<string>(),
  error: overrides.error ?? null,
});

// Mock the useBookmarksContext hook
jest.mock("@/hooks/useBookmarks", () => ({
  useBookmarksContext: jest.fn(),
}));

// Mock useKeyboardShortcuts to avoid event listener issues
jest.mock("@/hooks/useKeyboardShortcuts", () => ({
  useKeyboardShortcuts: jest.fn(),
}));

describe("BookmarkList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to default mock by default
    const { useBookmarksContext } = require("@/hooks/useBookmarks");
    useBookmarksContext.mockReturnValue(createMockContext());
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

  it("search input filters displayed bookmarks", () => {
    const { useBookmarksContext } = require("@/hooks/useBookmarks");
    useBookmarksContext.mockReturnValue(createMockContext({
      filteredBookmarks: [mockBookmarks[0]],
      searchTerm: "First",
    }));

    render(<BookmarkList />);

    expect(screen.getByText("First Bookmark")).toBeInTheDocument();
    expect(screen.queryByText("Second Bookmark")).not.toBeInTheDocument();
    expect(screen.queryByText("Third Bookmark")).not.toBeInTheDocument();
  });

  it("search input has correct placeholder", () => {
    render(<BookmarkList />);

    expect(screen.getByPlaceholderText(/search bookmarks/i)).toBeInTheDocument();
  });

  it("displays error message when error is present", () => {
    const { useBookmarksContext } = require("@/hooks/useBookmarks");
    useBookmarksContext.mockReturnValue(createMockContext({
      error: "Test error message",
    }));

    render(<BookmarkList />);

    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("has an Add bookmark button in the toolbar", () => {
    render(<BookmarkList />);

    expect(screen.getByRole("button", { name: /add bookmark/i })).toBeInTheDocument();
  });
});
