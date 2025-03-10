// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import React from "react";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: "/",
    query: {},
  }),
  usePathname: jest.fn().mockReturnValue("/"),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}));

// Mock Clerk authentication
jest.mock("@clerk/nextjs", () => ({
  auth: jest.fn().mockReturnValue({
    userId: "test-user-id",
    getToken: jest.fn().mockResolvedValue("test-token"),
  }),
  currentUser: jest.fn().mockResolvedValue({
    id: "test-user-id",
    username: "testuser",
  }),
  useUser: jest.fn().mockReturnValue({
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: "test-user-id",
      username: "testuser",
    },
  }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
}));
