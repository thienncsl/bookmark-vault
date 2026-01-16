import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ErrorBoundary } from "../ErrorBoundary";
import { ErrorFallback } from "../ErrorFallback";

describe("ErrorBoundary", () => {
  const error = new Error("Test error message");

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div data-testid="child-content">normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("renders fallback when child throws an error", () => {
    const ThrowError = () => {
      throw error;
    };

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("logs error to console with stack trace", () => {
    const ThrowError = () => {
      throw error;
    };

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith(
      "Error caught by ErrorBoundary:",
      error
    );
  });

  it("shows try again button", () => {
    const ThrowError = () => {
      throw error;
    };

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("resets state when try again button is clicked", async () => {
    let shouldThrow = true;

    const ThrowError = () => {
      if (shouldThrow) {
        throw error;
      }
      return <div data-testid="recovered">recovered content</div>;
    };

    const { rerender } = render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    shouldThrow = false;
    rerender(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText("Try again"));

    await waitFor(() => {
      expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
    });
  });

  it("handles errors in nested children", () => {
    const NestedError = () => {
      throw new Error("Nested error");
    };

    const ParentComponent = () => (
      <div>
        <span data-testid="parent-rendered">Parent rendered</span>
        <NestedError />
      </div>
    );

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ParentComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Nested error")).toBeInTheDocument();
  });

  it("accepts custom fallback component", () => {
    const CustomFallback = () => <div data-testid="custom-fallback">Custom error page</div>;

    const ThrowError = () => {
      throw error;
    };

    render(
      <ErrorBoundary FallbackComponent={CustomFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
  });
});
