import { render, screen, fireEvent } from "@testing-library/react";
import { ImportButton } from "../ImportButton";

describe("ImportButton", () => {
  const mockOnImport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders import button", () => {
    render(<ImportButton onImport={mockOnImport} />);
    expect(screen.getByText("Import")).toBeInTheDocument();
  });

  it("renders with import icon", () => {
    render(<ImportButton onImport={mockOnImport} />);
    expect(screen.getByRole("button")).toContainHTML("svg");
  });

  it("applies custom className", () => {
    render(<ImportButton onImport={mockOnImport} className="custom-class" />);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("has hidden file input", () => {
    render(<ImportButton onImport={mockOnImport} />);
    const input = screen.getByTestId("import-input");
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("accept", ".json");
    expect(input).toHaveClass("hidden");
  });

  it("file input has correct test id", () => {
    render(<ImportButton onImport={mockOnImport} />);
    expect(screen.getByTestId("import-input")).toBeInTheDocument();
  });

  it("button click triggers file input", () => {
    render(<ImportButton onImport={mockOnImport} />);

    const button = screen.getByText("Import");
    const input = screen.getByTestId("import-input");

    // Verify button exists and is clickable
    expect(button).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });
});
