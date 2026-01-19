import { render, screen, fireEvent } from "@testing-library/react";
import { ExportButton } from "../ExportButton";

// Mock URL.createObjectURL for jsdom
beforeAll(() => {
  if (typeof URL.createObjectURL === "undefined") {
    Object.defineProperty(URL, "createObjectURL", {
      value: jest.fn(() => "blob:mock-url"),
      writable: true,
    });
  }
  Object.defineProperty(URL, "revokeObjectURL", {
    value: jest.fn(),
    writable: true,
  });
});

describe("ExportButton", () => {
  const mockBookmarks = [
    {
      id: "1",
      title: "Test Bookmark",
      url: "https://example.com",
      description: "Test description",
      tags: ["test", "example"],
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  ];

  it("renders export button", () => {
    render(<ExportButton bookmarks={[]} />);
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<ExportButton bookmarks={[]} label="Export All" />);
    expect(screen.getByText("Export All")).toBeInTheDocument();
  });

  it("renders with export icon", () => {
    render(<ExportButton bookmarks={[]} />);
    expect(screen.getByRole("button")).toContainHTML("svg");
  });

  it("applies custom className", () => {
    render(<ExportButton bookmarks={[]} className="custom-class" />);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("handles empty bookmarks array", () => {
    render(<ExportButton bookmarks={[]} />);
    expect(() => {
      fireEvent.click(screen.getByText("Export"));
    }).not.toThrow();
  });

  it("handles bookmarks with special characters", () => {
    const specialBookmarks = [
      {
        id: "1",
        title: 'Test "quotes" & <tags>',
        url: "https://example.com",
        tags: ["tag'with\"quotes"],
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];
    render(<ExportButton bookmarks={specialBookmarks} />);
    expect(() => {
      fireEvent.click(screen.getByText("Export"));
    }).not.toThrow();
  });

  it("handles unicode characters in bookmarks", () => {
    const unicodeBookmarks = [
      {
        id: "1",
        title: "测试书签",
        url: "https://例.com",
        tags: ["日本語"],
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];
    render(<ExportButton bookmarks={unicodeBookmarks} />);
    expect(() => {
      fireEvent.click(screen.getByText("Export"));
    }).not.toThrow();
  });
});
