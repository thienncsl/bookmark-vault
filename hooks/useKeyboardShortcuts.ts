"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseKeyboardShortcutsProps {
  titleInputRef: React.RefObject<HTMLInputElement | null>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onClearForm: () => void;
  onSetFocusedIndex: (index: number) => void;
  onBlurActiveElement: () => void;
  bookmarkCount: number;
}

export function useKeyboardShortcuts({
  titleInputRef,
  searchInputRef,
  onClearForm,
  onSetFocusedIndex,
  onBlurActiveElement,
  bookmarkCount,
}: UseKeyboardShortcutsProps): void {
  const focusedIndexRef = useRef(0);

  const focusTitleInput = useCallback(() => {
    titleInputRef.current?.focus();
  }, [titleInputRef]);

  const focusSearchInput = useCallback(() => {
    searchInputRef.current?.focus();
  }, [searchInputRef]);

  const clearFormAndUnfocus = useCallback(() => {
    onClearForm();
    onBlurActiveElement();
    focusedIndexRef.current = 0;
  }, [onClearForm, onBlurActiveElement]);

  const handleArrowRight = useCallback(() => {
    if (bookmarkCount === 0) return;
    focusedIndexRef.current = Math.min(focusedIndexRef.current + 1, bookmarkCount - 1);
    onSetFocusedIndex(focusedIndexRef.current);
  }, [bookmarkCount, onSetFocusedIndex]);

  const handleArrowLeft = useCallback(() => {
    if (bookmarkCount === 0) return;
    focusedIndexRef.current = Math.max(focusedIndexRef.current - 1, 0);
    onSetFocusedIndex(focusedIndexRef.current);
  }, [bookmarkCount, onSetFocusedIndex]);

  const handleArrowDown = useCallback(() => {
    if (bookmarkCount === 0) return;
    focusedIndexRef.current = Math.min(focusedIndexRef.current + 1, bookmarkCount - 1);
    onSetFocusedIndex(focusedIndexRef.current);
  }, [bookmarkCount, onSetFocusedIndex]);

  const handleArrowUp = useCallback(() => {
    if (bookmarkCount === 0) return;
    focusedIndexRef.current = Math.max(focusedIndexRef.current - 1, 0);
    onSetFocusedIndex(focusedIndexRef.current);
  }, [bookmarkCount, onSetFocusedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifierPressed = e.ctrlKey || e.metaKey;

      if ((e.key === "n" || e.key === "N") && isModifierPressed) {
        e.preventDefault();
        focusTitleInput();
        return;
      }

      if ((e.key === "f" || e.key === "F") && isModifierPressed) {
        e.preventDefault();
        focusSearchInput();
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        clearFormAndUnfocus();
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleArrowRight();
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleArrowLeft();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        handleArrowDown();
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        handleArrowUp();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    focusTitleInput,
    focusSearchInput,
    clearFormAndUnfocus,
    handleArrowRight,
    handleArrowLeft,
    handleArrowDown,
    handleArrowUp,
  ]);
}
