// Mock localStorage
type JestMock<T> = jest.Mock<T>;

interface LocalStorageMock {
  getItem: JestMock<(key: string) => string | null>;
  setItem: JestMock<(key: string, value: string) => void>;
  removeItem: JestMock<(key: string) => void>;
  clear: JestMock<() => void>;
}

const localStorageMock: LocalStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Add jest-dom matchers
import "@testing-library/jest-dom";
