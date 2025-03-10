import { prismaMock } from "../helpers/mockDb";
import { userService } from "~/services/user";
import { auth } from "@clerk/nextjs/server";

// Mock Clerk auth
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
  clerkClient: {
    users: {
      getUser: jest.fn(),
    },
  },
}));

// Mock UserSchema
jest.mock("~/types/user", () => ({
  UserSchema: {
    parse: jest.fn().mockImplementation((data) => data),
  },
  UserType: {},
}));

// Mock defaultCategories
jest.mock("~/lib/utils", () => ({
  defaultCategories: [
    {
      name: "Work",
      color: "#4285F4",
      icon: "briefcase",
      priority: 1,
      order: 1,
    },
    {
      name: "Personal",
      color: "#EA4335",
      icon: "user",
      priority: 2,
      order: 2,
    },
  ],
  Category: {},
}));

describe("UserService", () => {
  const mockDate = new Date("2023-01-01T12:00:00Z");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("getCurrentUser", () => {
    test("should return the current user when authenticated", async () => {
      // Mock Clerk auth to return a userId
      (auth as jest.Mock).mockResolvedValue({
        userId: "clerk_user_123",
      });

      // Mock finding the user in the database
      prismaMock.user.findUnique.mockResolvedValue({
        id: "db-user-123",
        clerkId: "clerk_user_123",
        email: "test@example.com",
        username: "testuser",
        name: "Test User",
        createdAt: mockDate,
        updatedAt: mockDate,
        onboardingComplete: true,
        lastLoginAt: mockDate,
        timezone: "UTC",
      });

      const result = await userService.getCurrentUser();

      expect(result).not.toBeNull();
      expect(result?.clerkId).toBe("clerk_user_123");
      expect(result?.username).toBe("testuser");

      // Verify that findUnique was called with the right parameters
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { clerkId: "clerk_user_123" },
      });
    });

    test("should return null when not authenticated", async () => {
      // Mock Clerk auth to return no userId
      (auth as jest.Mock).mockResolvedValue({
        userId: null,
      });

      const result = await userService.getCurrentUser();

      expect(result).toBeNull();
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    });

    test("should handle errors gracefully", async () => {
      // Mock Clerk auth to throw an error
      (auth as jest.Mock).mockRejectedValue(new Error("Auth failed"));

      const result = await userService.getCurrentUser();

      expect(result).toBeNull();
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    });
  });

  describe("checkUsernameExists", () => {
    test("should return true if username exists", async () => {
      const username = "existinguser";

      // Mock finding a user with the username
      prismaMock.user.findFirst.mockResolvedValue({
        id: "db-user-123",
        clerkId: "clerk_user_123",
        email: "existing@example.com",
        username,
        name: "Existing User",
        createdAt: mockDate,
        updatedAt: mockDate,
        onboardingComplete: true,
        lastLoginAt: mockDate,
        timezone: "UTC",
      });

      const result = await userService.checkUsernameExists(username);

      expect(result).toBe(true);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { username },
      });
    });

    test("should return false if username doesn't exist", async () => {
      const username = "newuser";

      // Mock not finding a user with the username
      prismaMock.user.findFirst.mockResolvedValue(null);

      const result = await userService.checkUsernameExists(username);

      expect(result).toBe(false);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { username },
      });
    });
  });

  describe("createUser", () => {
    test("should create a user successfully", async () => {
      const userData = {
        clerkId: "clerk_user_123",
        email: "new@example.com",
        username: "newuser",
        name: "New User",
        timezone: "UTC",
      };

      // Mock user creation
      prismaMock.user.create.mockResolvedValue({
        id: "db-user-123",
        ...userData,
        createdAt: mockDate,
        updatedAt: mockDate,
        onboardingComplete: false,
        lastLoginAt: null,
      });

      const result = await userService.createUser(userData);

      expect(result).toHaveProperty("id", "db-user-123");
      expect(result.clerkId).toBe("clerk_user_123");
      expect(result.username).toBe("newuser");
      expect(result.email).toBe("new@example.com");

      // Verify that create was called with the right data
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: userData,
      });
    });
  });

  describe("getUserById", () => {
    test("should return a user by clerkId", async () => {
      const clerkId = "clerk_user_123";

      // Mock finding the user
      prismaMock.user.findUnique.mockResolvedValue({
        id: "db-user-123",
        clerkId,
        email: "test@example.com",
        username: "testuser",
        name: "Test User",
        createdAt: mockDate,
        updatedAt: mockDate,
        onboardingComplete: true,
        lastLoginAt: mockDate,
        timezone: "UTC",
      });

      const result = await userService.getUserById(clerkId);

      expect(result).not.toBeNull();
      expect(result?.clerkId).toBe(clerkId);
      expect(result?.username).toBe("testuser");

      // Verify that findUnique was called with the right parameters
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { clerkId },
      });
    });

    test("should return null if user not found", async () => {
      const clerkId = "nonexistent_user";

      // Mock user not found
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await userService.getUserById(clerkId);

      expect(result).toBeNull();
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { clerkId },
      });
    });
  });

  describe("updateUser", () => {
    test("should update a user successfully", async () => {
      const clerkId = "clerk_user_123";
      const updateData = {
        name: "Updated User",
        timezone: "America/New_York",
      };

      // Mock the update
      prismaMock.user.update.mockResolvedValue({
        id: "db-user-123",
        clerkId,
        email: "test@example.com",
        username: "testuser",
        name: "Updated User",
        timezone: "America/New_York",
        createdAt: mockDate,
        updatedAt: mockDate,
        onboardingComplete: true,
        lastLoginAt: mockDate,
      });

      const result = await userService.updateUser(clerkId, updateData);

      expect(result.name).toBe("Updated User");
      expect(result.timezone).toBe("America/New_York");

      // Verify that update was called with the right parameters
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { clerkId },
        data: updateData,
      });
    });
  });

  describe("deleteUser", () => {
    test("should delete a user successfully", async () => {
      const clerkId = "clerk_user_123";

      // Mock user existence check
      prismaMock.user.findUnique.mockResolvedValue({
        id: "db-user-123",
        clerkId,
        email: "test@example.com",
        username: "testuser",
        name: "Test User",
        createdAt: mockDate,
        updatedAt: mockDate,
        onboardingComplete: true,
        lastLoginAt: mockDate,
        timezone: "UTC",
      });

      // Mock the delete operation for related entities
      prismaMock.task.deleteMany.mockResolvedValue({ count: 2 });
      prismaMock.habit.deleteMany.mockResolvedValue({ count: 3 });
      prismaMock.goal.deleteMany.mockResolvedValue({ count: 1 });
      prismaMock.routine.deleteMany.mockResolvedValue({ count: 0 });
      prismaMock.category.deleteMany.mockResolvedValue({ count: 4 });

      // Mock the user deletion
      prismaMock.user.delete.mockResolvedValue({
        id: "db-user-123",
        clerkId,
        email: "test@example.com",
        username: "testuser",
        name: "Test User",
        createdAt: mockDate,
        updatedAt: mockDate,
        onboardingComplete: true,
        lastLoginAt: mockDate,
        timezone: "UTC",
      });

      const result = await userService.deleteUser(clerkId);

      expect(result).toHaveProperty("id", "db-user-123");
      expect(result.clerkId).toBe(clerkId);

      // Verify all delete operations were called with the right parameters
      expect(prismaMock.task.deleteMany).toHaveBeenCalledWith({
        where: { userId: "db-user-123" },
      });
      expect(prismaMock.habit.deleteMany).toHaveBeenCalledWith({
        where: { userId: "db-user-123" },
      });
      expect(prismaMock.goal.deleteMany).toHaveBeenCalledWith({
        where: { userId: "db-user-123" },
      });
      expect(prismaMock.routine.deleteMany).toHaveBeenCalledWith({
        where: { userId: "db-user-123" },
      });
      expect(prismaMock.category.deleteMany).toHaveBeenCalledWith({
        where: { userId: "db-user-123" },
      });
      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { clerkId },
      });
    });

    test("should throw an error if user not found", async () => {
      const clerkId = "nonexistent_user";

      // Mock user not found
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(userService.deleteUser(clerkId)).rejects.toThrow(
        /user not found/i,
      );

      // Verify no delete operations were called
      expect(prismaMock.task.deleteMany).not.toHaveBeenCalled();
      expect(prismaMock.user.delete).not.toHaveBeenCalled();
    });
  });

  describe("createUserWithDefaultCategories", () => {
    test("should create a user with default categories", async () => {
      const userData = {
        clerkId: "clerk_user_123",
        email: "new@example.com",
        username: "newuser",
        name: "New User",
        timezone: "UTC",
      };

      // Mock transaction
      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        return await callback(prismaMock);
      });

      // Replace the transaction method on prismaMock
      prismaMock.$transaction = mockTransaction;

      // Mock user creation in transaction
      prismaMock.user.create.mockResolvedValue({
        id: "db-user-123",
        ...userData,
        createdAt: mockDate,
        updatedAt: mockDate,
        onboardingComplete: false,
        lastLoginAt: null,
      });

      // Mock category creation in transaction
      prismaMock.category.create
        .mockResolvedValueOnce({
          id: "category-1",
          name: "Work",
          color: "#4285F4",
          icon: "briefcase",
          priority: 1,
          order: 1,
          userId: "db-user-123",
          description: null,
          createdAt: mockDate,
          updatedAt: mockDate,
        })
        .mockResolvedValueOnce({
          id: "category-2",
          name: "Personal",
          color: "#EA4335",
          icon: "user",
          priority: 2,
          order: 2,
          userId: "db-user-123",
          description: null,
          createdAt: mockDate,
          updatedAt: mockDate,
        });

      const result =
        await userService.createUserWithDefaultCategories(userData);

      expect(result).toHaveProperty("id", "db-user-123");
      expect(result.clerkId).toBe("clerk_user_123");

      // Verify transaction was called
      expect(mockTransaction).toHaveBeenCalled();

      // Verify user creation was called
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: userData,
      });

      // Verify category creation was called twice (for the 2 default categories)
      expect(prismaMock.category.create).toHaveBeenCalledTimes(2);
    });
  });

  describe("updateUserLoginTimestamp", () => {
    test("should update the lastLoginAt timestamp", async () => {
      const clerkId = "clerk_user_123";

      // Mock the update
      prismaMock.user.update.mockResolvedValue({
        id: "db-user-123",
        clerkId,
        email: "test@example.com",
        username: "testuser",
        name: "Test User",
        createdAt: mockDate,
        updatedAt: mockDate,
        onboardingComplete: true,
        lastLoginAt: mockDate, // Updated timestamp
        timezone: "UTC",
      });

      const result = await userService.updateUserLoginTimestamp(clerkId);

      expect(result.lastLoginAt).toEqual(mockDate);

      // Verify that update was called with the right parameters
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { clerkId },
        data: { lastLoginAt: mockDate },
      });
    });
  });
});
