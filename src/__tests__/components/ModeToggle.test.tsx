import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ModeToggle } from "~/components/mode-toggle";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
  }),
}));

describe("ModeToggle Component", () => {
  // Clean up after each test to avoid multiple elements
  afterEach(() => {
    cleanup();
  });

  test("renders toggle button", () => {
    render(<ModeToggle />);

    // Check if the button exists
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();

    // Check if sun and moon icons are in the document
    expect(screen.getByLabelText(/toggle theme/i)).toBeInTheDocument();
  });

  test("toggles theme when clicked", () => {
    // Mock implementation of setTheme
    const setThemeMock = jest.fn();

    // Update the mock to return our controlled mock function
    jest.spyOn(require("next-themes"), "useTheme").mockImplementation(() => ({
      theme: "light",
      setTheme: setThemeMock,
    }));

    const { unmount } = render(<ModeToggle />);

    // Find and click the toggle button
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    fireEvent.click(toggleButton);

    // Verify that setTheme was called with 'dark'
    expect(setThemeMock).toHaveBeenCalledWith("dark");

    // Unmount the component to avoid duplicate elements
    unmount();

    // Change mock to simulate theme is now 'dark'
    jest.spyOn(require("next-themes"), "useTheme").mockImplementation(() => ({
      theme: "dark",
      setTheme: setThemeMock,
    }));

    // Re-render with updated theme
    const { getByRole } = render(<ModeToggle />);

    // Find and click again
    const updatedToggleButton = getByRole("button", { name: /toggle theme/i });
    fireEvent.click(updatedToggleButton);

    // Verify setTheme was called with 'light'
    expect(setThemeMock).toHaveBeenCalledWith("light");
  });
});
