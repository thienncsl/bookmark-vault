import {
  getBookmarks,
  addBookmark,
  deleteBookmark,
  searchBookmarks,
} from "../storage";

describe("storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (localStorage.clear as jest.Mock).mockClear();
  });

  describe("getBookmarks", () => {
    it("returns empty array when localStorage is empty", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      const result = getBookmarks();

      expect(result).toEqual([]);
    });

    it("returns empty array when localStorage has no data", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue("");

      const result = getBookmarks();

      expect(result).toEqual([]);
    });

    it("returns parsed bookmarks from localStorage", () => {
      const bookmarks = [
        {
          id: "test-id-1",
          title: "Test Bookmark 1",
          url: "https://example.com",
          description: "Test description",
          tags: ["test"],
          createdAt: "2024-01-01T00:00:00.000Z",
        },
      ];
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(bookmarks));

      const result = getBookmarks();

      expect(result).toEqual(bookmarks);
    });

    it("returns empty array on invalid JSON", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue("invalid json");

      const result = getBookmarks();

      expect(result).toEqual([]);
    });

    it("returns empty array when typeof window is undefined", () => {
      const originalWindow = global.window;
      delete (global as unknown as Record<string, unknown>).window;

      const result = getBookmarks();

      expect(result).toEqual([]);
      global.window = originalWindow;
    });
  });

  describe("addBookmark", () => {
    it("adds bookmark to storage with id and createdAt", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      const input = {
        title: "New Bookmark",
        url: "https://new-example.com",
        description: "New description",
        tags: ["tag1", "tag2"],
      };

      const result = addBookmark(input);

      expect(result).toMatchObject({
        title: "New Bookmark",
        url: "https://new-example.com",
        description: "New description",
        tags: ["tag1", "tag2"],
      });
      expect(result.id).toBe("mock-uuid-v4");
      expect(result.createdAt).toBeDefined();
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it("prepends new bookmark to existing list", () => {
      const existingBookmarks = [
        {
          id: "existing-id",
          title: "Existing",
          url: "https://existing.com",
          tags: [],
          createdAt: "2024-01-01T00:00:00.000Z",
        },
      ];
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(existingBookmarks));

      const result = addBookmark({
        title: "New",
        url: "https://new.com",
        tags: [],
      });

      expect(result.title).toBe("New");
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "bookmark-vault-data",
        expect.stringContaining("New")
      );
    });
  });

  describe("deleteBookmark", () => {
    it("removes bookmark by id from storage", () => {
      const bookmarks = [
        {
          id: "to-delete",
          title: "To Delete",
          url: "https://delete.com",
          tags: [],
          createdAt: "2024-01-01T00:00:00.000Z",
        },
        {
          id: "to-keep",
          title: "To Keep",
          url: "https://keep.com",
          tags: [],
          createdAt: "2024-01-01T00:00:00.000Z",
        },
      ];
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(bookmarks));

      deleteBookmark("to-delete");

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "bookmark-vault-data",
        expect.not.stringContaining("to-delete")
      );
    });

    it("does nothing when id does not exist", () => {
      const bookmarks = [
        {
          id: "keep-id",
          title: "Keep",
          url: "https://keep.com",
          tags: [],
          createdAt: "2024-01-01T00:00:00.000Z",
        },
      ];
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(bookmarks));

      deleteBookmark("non-existent-id");

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "bookmark-vault-data",
        JSON.stringify(bookmarks)
      );
    });
  });

  describe("searchBookmarks", () => {
    const bookmarks = [
      {
        id: "1",
        title: "Google",
        url: "https://google.com",
        description: "Search engine",
        tags: ["search", "tech"],
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        title: "GitHub",
        url: "https://github.com",
        description: "Code hosting",
        tags: ["coding", "dev"],
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "3",
        title: "Stack Overflow",
        url: "https://stackoverflow.com",
        description: "Q&A for developers",
        tags: ["help", "coding"],
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];

    beforeEach(() => {
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(bookmarks));
    });

    it("returns all bookmarks when query is empty", () => {
      const result = searchBookmarks("");

      expect(result).toHaveLength(3);
    });

    it("filters by title", () => {
      const result = searchBookmarks("GitHub");

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("GitHub");
    });

    it("filters by url", () => {
      const result = searchBookmarks("google.com");

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Google");
    });

    it("filters by description", () => {
      const result = searchBookmarks("developers");

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Stack Overflow");
    });

    it("filters by tags", () => {
      const result = searchBookmarks("search");

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Google");
    });

    it("is case insensitive", () => {
      const result = searchBookmarks("GITHUB");

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("GitHub");
    });

    it("returns empty array when no matches", () => {
      const result = searchBookmarks("nonexistent");

      expect(result).toEqual([]);
    });

    it("trims whitespace from query", () => {
      const result = searchBookmarks("  Google  ");

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Google");
    });
  });
});
