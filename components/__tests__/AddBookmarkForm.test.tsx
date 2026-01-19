import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddBookmarkForm } from "../AddBookmarkForm";

// Mock the useBookmarksContext hook
jest.mock("@/hooks/useBookmarks", () => ({
  useBookmarksContext: () => ({
    addBookmark: jest.fn(),
  }),
}));

// Mock useKeyboardShortcuts to avoid event listener issues
jest.mock("@/hooks/useKeyboardShortcuts", () => ({
  useKeyboardShortcuts: jest.fn(),
}));

describe("AddBookmarkForm", () => {
  const mockOnBookmarkAdded = jest.fn();
  const mockAddBookmark = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Re-setup mock with fresh functions
    jest.doMock("@/hooks/useBookmarks", () => ({
      useBookmarksContext: () => ({
        addBookmark: mockAddBookmark,
      }),
    }));
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
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid URL format", async () => {
    render(<AddBookmarkForm onBookmarkAdded={mockOnBookmarkAdded} />);

    // Fill in title but invalid URL
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Test Bookmark" } });
    fireEvent.change(screen.getByLabelText(/url/i), { target: { value: "not-a-valid-url" } });

    const submitButton = screen.getByRole("button", { name: /add bookmark/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/url must be a valid url/i)).toBeInTheDocument();
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

    await waitFor(() => {
      expect(mockAddBookmark).toHaveBeenCalledWith({
        title: "Test Bookmark",
        url: "https://example.com",
        description: "Test description",
        tags: ["tag1", "tag2"],
      });
      expect(mockOnBookmarkAdded).toHaveBeenCalled();
    });
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

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue("");
      expect(screen.getByLabelText(/url/i)).toHaveValue("");
      expect(screen.getByLabelText(/description/i)).toHaveValue("");
      expect(screen.getByLabelText(/tags/i)).toHaveValue("");
    });
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
