import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddBookmarkForm } from "../AddBookmarkForm";

// Create mock functions at module level
const mockAddBookmark = jest.fn();
const mockOnBookmarkAdded = jest.fn();

// Mock the useBookmarksContext hook
jest.mock("@/hooks/useBookmarks", () => ({
  useBookmarksContext: () => ({
    addBookmark: mockAddBookmark,
    bookmarks: [],
  }),
}));

// Mock useKeyboardShortcuts to avoid event listener issues
jest.mock("@/hooks/useKeyboardShortcuts", () => ({
  useKeyboardShortcuts: jest.fn(),
}));

describe("AddBookmarkForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<AddBookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add bookmark/i })).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    render(<AddBookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />);

    const submitButton = screen.getByRole("button", { name: /add bookmark/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it("calls onBookmarkAdded callback with correct data on valid submit", async () => {
    const user = userEvent.setup();
    render(<AddBookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />);

    await user.type(screen.getByLabelText(/title/i), "Test Bookmark");
    await user.type(screen.getByLabelText(/url/i), "https://example.com");
    await user.type(screen.getByLabelText(/description/i), "Test description");
    await user.type(screen.getByLabelText(/tags/i), "tag1, tag2");

    const submitButton = screen.getByRole("button", { name: /add bookmark/i });
    await user.click(submitButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/bookmark added successfully/i)).toBeInTheDocument();
    });

    // Verify addBookmark was called
    expect(mockAddBookmark).toHaveBeenCalledTimes(1);
    const callArgs = mockAddBookmark.mock.calls[0][0];
    expect(callArgs.title).toBe("Test Bookmark");
    expect(callArgs.url).toBe("https://example.com");
    expect(callArgs.description).toBe("Test description");
    expect(callArgs.tags).toEqual(["tag1", "tag2"]);
    expect(mockOnBookmarkAdded).toHaveBeenCalled();
  });

  it("clears form fields after successful submit", async () => {
    const user = userEvent.setup();
    render(<AddBookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />);

    await user.type(screen.getByLabelText(/title/i), "Test Bookmark");
    await user.type(screen.getByLabelText(/url/i), "https://example.com");
    await user.type(screen.getByLabelText(/description/i), "Test description");
    await user.type(screen.getByLabelText(/tags/i), "tag1, tag2");

    const submitButton = screen.getByRole("button", { name: /add bookmark/i });
    await user.click(submitButton);

    // Wait for success message which indicates form was cleared
    await waitFor(() => {
      expect(screen.getByText(/bookmark added successfully/i)).toBeInTheDocument();
    });

    // Form should be cleared after successful submit
    expect(screen.getByLabelText(/title/i)).toHaveValue("");
    expect(screen.getByLabelText(/url/i)).toHaveValue("");
    expect(screen.getByLabelText(/description/i)).toHaveValue("");
    expect(screen.getByLabelText(/tags/i)).toHaveValue("");
  });

  it("shows success message after successful submit", async () => {
    const user = userEvent.setup();
    render(<AddBookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />);

    await user.type(screen.getByLabelText(/title/i), "Test Bookmark");
    await user.type(screen.getByLabelText(/url/i), "https://example.com");

    const submitButton = screen.getByRole("button", { name: /add bookmark/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/bookmark added successfully/i)).toBeInTheDocument();
    });
  });

  it("handles form input changes", async () => {
    const user = userEvent.setup();
    render(<AddBookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />);

    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    await user.type(titleInput, "New Title");

    expect(titleInput).toHaveValue("New Title");
  });

  it("clears error when user starts typing", async () => {
    const user = userEvent.setup();
    render(<AddBookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />);

    // Submit empty form to trigger error
    const submitButton = screen.getByRole("button", { name: /add bookmark/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.type(screen.getByLabelText(/title/i), "Test");

    await waitFor(() => {
      expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
    });
  });
});
