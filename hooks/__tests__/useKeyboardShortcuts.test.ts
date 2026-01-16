import { renderHook, act } from "@testing-library/react";
import { useKeyboardShortcuts } from "../useKeyboardShortcuts";

describe("useKeyboardShortcuts", () => {
  let mockClearForm: jest.Mock;
  let mockSetFocusedIndex: jest.Mock;
  let mockBlurActiveElement: jest.Mock;
  let titleInput: HTMLInputElement;
  let searchInput: HTMLInputElement;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClearForm = jest.fn();
    mockSetFocusedIndex = jest.fn();
    mockBlurActiveElement = jest.fn();

    document.body.innerHTML = `
      <input data-testid="title-input" />
      <input data-testid="search-input" />
      <div data-testid="bookmark-card-0"></div>
      <div data-testid="bookmark-card-1"></div>
      <div data-testid="bookmark-card-2"></div>
    `;

    titleInput = document.querySelector('[data-testid="title-input"]') as HTMLInputElement;
    searchInput = document.querySelector('[data-testid="search-input"]') as HTMLInputElement;

    jest.spyOn(titleInput, "focus");
    jest.spyOn(searchInput, "focus");
  });

  describe("Ctrl+N or Cmd+N", () => {
    it("focuses the title input on Ctrl+N", () => {
      const { unmount } = renderHook(() =>
        useKeyboardShortcuts({
          titleInputRef: { current: titleInput },
          searchInputRef: { current: null },
          onClearForm: mockClearForm,
          onSetFocusedIndex: mockSetFocusedIndex,
          onBlurActiveElement: mockBlurActiveElement,
          bookmarkCount: 0,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "n",
          ctrlKey: true,
        });
        document.dispatchEvent(event);
      });

      expect(titleInput.focus).toHaveBeenCalled();
      unmount();
    });

    it("focuses the title input on Cmd+N (Mac)", () => {
      const { unmount } = renderHook(() =>
        useKeyboardShortcuts({
          titleInputRef: { current: titleInput },
          searchInputRef: { current: null },
          onClearForm: mockClearForm,
          onSetFocusedIndex: mockSetFocusedIndex,
          onBlurActiveElement: mockBlurActiveElement,
          bookmarkCount: 0,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "n",
          metaKey: true,
        });
        document.dispatchEvent(event);
      });

      expect(titleInput.focus).toHaveBeenCalled();
      unmount();
    });
  });

  describe("Ctrl+F or Cmd+F", () => {
    it("focuses the search input on Ctrl+F", () => {
      const { unmount } = renderHook(() =>
        useKeyboardShortcuts({
          titleInputRef: { current: null },
          searchInputRef: { current: searchInput },
          onClearForm: mockClearForm,
          onSetFocusedIndex: mockSetFocusedIndex,
          onBlurActiveElement: mockBlurActiveElement,
          bookmarkCount: 0,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "f",
          ctrlKey: true,
        });
        document.dispatchEvent(event);
      });

      expect(searchInput.focus).toHaveBeenCalled();
      unmount();
    });

    it("focuses the search input on Cmd+F (Mac)", () => {
      const { unmount } = renderHook(() =>
        useKeyboardShortcuts({
          titleInputRef: { current: null },
          searchInputRef: { current: searchInput },
          onClearForm: mockClearForm,
          onSetFocusedIndex: mockSetFocusedIndex,
          onBlurActiveElement: mockBlurActiveElement,
          bookmarkCount: 0,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "f",
          metaKey: true,
        });
        document.dispatchEvent(event);
      });

      expect(searchInput.focus).toHaveBeenCalled();
      unmount();
    });
  });

  describe("Escape", () => {
    it("clears form and unfocuses inputs on Escape", () => {
      const { unmount } = renderHook(() =>
        useKeyboardShortcuts({
          titleInputRef: { current: null },
          searchInputRef: { current: null },
          onClearForm: mockClearForm,
          onSetFocusedIndex: mockSetFocusedIndex,
          onBlurActiveElement: mockBlurActiveElement,
          bookmarkCount: 0,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "Escape",
        });
        document.dispatchEvent(event);
      });

      expect(mockClearForm).toHaveBeenCalled();
      expect(mockBlurActiveElement).toHaveBeenCalled();
      unmount();
    });
  });

  describe("Arrow keys navigation", () => {
    it("moves focus to next bookmark on ArrowRight", () => {
      const { unmount } = renderHook(() =>
        useKeyboardShortcuts({
          titleInputRef: { current: null },
          searchInputRef: { current: null },
          onClearForm: mockClearForm,
          onSetFocusedIndex: mockSetFocusedIndex,
          onBlurActiveElement: mockBlurActiveElement,
          bookmarkCount: 3,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "ArrowRight",
        });
        document.dispatchEvent(event);
      });

      expect(mockSetFocusedIndex).toHaveBeenCalledWith(1);
      unmount();
    });

    it("moves focus to previous bookmark on ArrowLeft from middle", () => {
      const { unmount } = renderHook(() =>
        useKeyboardShortcuts({
          titleInputRef: { current: null },
          searchInputRef: { current: null },
          onClearForm: mockClearForm,
          onSetFocusedIndex: mockSetFocusedIndex,
          onBlurActiveElement: mockBlurActiveElement,
          bookmarkCount: 3,
        })
      );

      // First move to index 1
      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "ArrowRight",
        });
        document.dispatchEvent(event);
      });

      mockSetFocusedIndex.mockClear();

      // Then move back to index 0
      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "ArrowLeft",
        });
        document.dispatchEvent(event);
      });

      expect(mockSetFocusedIndex).toHaveBeenCalledWith(0);
      unmount();
    });

    it("moves focus down on ArrowDown", () => {
      const { unmount } = renderHook(() =>
        useKeyboardShortcuts({
          titleInputRef: { current: null },
          searchInputRef: { current: null },
          onClearForm: mockClearForm,
          onSetFocusedIndex: mockSetFocusedIndex,
          onBlurActiveElement: mockBlurActiveElement,
          bookmarkCount: 3,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "ArrowDown",
        });
        document.dispatchEvent(event);
      });

      expect(mockSetFocusedIndex).toHaveBeenCalledWith(1);
      unmount();
    });

    it("moves focus up on ArrowUp from middle", () => {
      const { unmount } = renderHook(() =>
        useKeyboardShortcuts({
          titleInputRef: { current: null },
          searchInputRef: { current: null },
          onClearForm: mockClearForm,
          onSetFocusedIndex: mockSetFocusedIndex,
          onBlurActiveElement: mockBlurActiveElement,
          bookmarkCount: 3,
        })
      );

      // First move to index 1
      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "ArrowDown",
        });
        document.dispatchEvent(event);
      });

      mockSetFocusedIndex.mockClear();

      // Then move back to index 0
      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "ArrowUp",
        });
        document.dispatchEvent(event);
      });

      expect(mockSetFocusedIndex).toHaveBeenCalledWith(0);
      unmount();
    });

    it("does not navigate when no bookmarks exist", () => {
      const { unmount } = renderHook(() =>
        useKeyboardShortcuts({
          titleInputRef: { current: null },
          searchInputRef: { current: null },
          onClearForm: mockClearForm,
          onSetFocusedIndex: mockSetFocusedIndex,
          onBlurActiveElement: mockBlurActiveElement,
          bookmarkCount: 0,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "ArrowRight",
        });
        document.dispatchEvent(event);
      });

      expect(mockSetFocusedIndex).not.toHaveBeenCalled();
      unmount();
    });
  });
});
