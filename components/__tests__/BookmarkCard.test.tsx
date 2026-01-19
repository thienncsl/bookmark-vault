import { render, screen, fireEvent } from "@testing-library/react";
import { BookmarkCard } from "../BookmarkCard";
import type { Bookmark } from "@/lib/types";

describe("BookmarkCard", () => {
  const mockBookmark: Bookmark = {
    id: "test-id-123",
    title: "Test Bookmark",
    url: "https://example.com",
    description: "This is a test description",
    tags: ["test", "example", "sample"],
    createdAt: "2024-01-01T00:00:00.000Z",
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders bookmark title", () => {
    render(<BookmarkCard bookmark={mockBookmark} onDelete={mockOnDelete} />);

    expect(screen.getByText("Test Bookmark")).toBeInTheDocument();
  });

  it("renders bookmark url", () => {
    render(<BookmarkCard bookmark={mockBookmark} onDelete={mockOnDelete} />);

    expect(screen.getByText("https://example.com")).toBeInTheDocument();
  });

  it("renders bookmark description", () => {
    render(<BookmarkCard bookmark={mockBookmark} onDelete={mockOnDelete} />);

    expect(screen.getByText("This is a test description")).toBeInTheDocument();
  });

  it("renders all tags", () => {
    render(<BookmarkCard bookmark={mockBookmark} onDelete={mockOnDelete} />);

    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("example")).toBeInTheDocument();
    expect(screen.getByText("sample")).toBeInTheDocument();
  });

  it("delete button calls onDelete with correct id", () => {
    render(<BookmarkCard bookmark={mockBookmark} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByTitle("Delete bookmark");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith("test-id-123");
  });

  it("delete button calls onDelete with correct id only once", () => {
    render(<BookmarkCard bookmark={mockBookmark} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByTitle("Delete bookmark");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith("test-id-123");
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it("url link has correct href", () => {
    render(<BookmarkCard bookmark={mockBookmark} onDelete={mockOnDelete} />);

    const link = screen.getByRole("link", { name: /https:\/\/example\.com/i });
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("url link opens in new tab", () => {
    render(<BookmarkCard bookmark={mockBookmark} onDelete={mockOnDelete} />);

    const link = screen.getByRole("link", { name: /https:\/\/example\.com/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders without description when description is empty", () => {
    const bookmarkWithoutDescription: Bookmark = {
      ...mockBookmark,
      description: undefined,
    };

    render(<BookmarkCard bookmark={bookmarkWithoutDescription} onDelete={mockOnDelete} />);

    expect(screen.queryByText("This is a test description")).not.toBeInTheDocument();
  });

  it("renders without tags when tags array is empty", () => {
    const bookmarkWithoutTags: Bookmark = {
      ...mockBookmark,
      tags: [],
    };

    render(<BookmarkCard bookmark={bookmarkWithoutTags} onDelete={mockOnDelete} />);

    expect(screen.queryByText("test")).not.toBeInTheDocument();
  });

  it("applies focused styles when isFocused is true", () => {
    render(<BookmarkCard bookmark={mockBookmark} onDelete={mockOnDelete} isFocused={true} />);

    const card = screen.getByTestId("bookmark-card");
    expect(card.className).toContain("ring-blue-500");
  });

  it("applies pending add styles when isPendingAdd is true", () => {
    render(<BookmarkCard bookmark={mockBookmark} onDelete={mockOnDelete} isPendingAdd={true} />);

    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("applies pending delete styles when isPendingDelete is true", () => {
    render(<BookmarkCard bookmark={mockBookmark} onDelete={mockOnDelete} isPendingDelete={true} />);

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });

  it("is accessible via keyboard (tabIndex)", () => {
    render(<BookmarkCard bookmark={mockBookmark} onDelete={mockOnDelete} tabIndex={0} />);

    const card = screen.getByTestId("bookmark-card");
    expect(card).toHaveAttribute("tabIndex", "0");
  });
});
