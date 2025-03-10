import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

// Extended mock client with explicit model properties
export type MockClient = DeepMockProxy<PrismaClient> & {
  habit: any;
  routine: any;
  task: any;
  category: any;
  goal: any;
  user: any;
};

// Create the mock with the extended type
export const prismaMock = mockDeep<PrismaClient>() as unknown as MockClient;

// Mock the db module from src/server/db.ts
jest.mock("~/server/db", () => ({
  db: prismaMock,
}));

// Reset the mocks before each test
beforeEach(() => {
  mockReset(prismaMock);
});

// Add a simple test to avoid the "must contain at least one test" error
describe("PrismaMock Setup", () => {
  test("prismaMock should be defined", () => {
    expect(prismaMock).toBeDefined();
  });
});
