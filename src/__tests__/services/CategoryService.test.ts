import { prismaMock } from "../helpers/mockDb";
import { categoryService } from "~/services/category";

// Mock the CategorySchema
jest.mock("~/types/category", () => ({
  CategorySchema: {
    parse: jest.fn().mockImplementation((data) => data),
    partial: () => ({
      parse: jest.fn().mockImplementation((data) => data),
    }),
  },
  CategoryType: {},
}));

describe("CategoryService", () => {
  const mockDate = new Date("2023-01-01T12:00:00Z");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("createCategory", () => {
    test("should create a category successfully", async () => {
      const clerkId = "user_123456";
      const categoryData = {
        name: "Work",
        color: "#4285F4",
        icon: "briefcase",
        priority: 1,
        order: 1,
      };

      // Mock the category creation
      prismaMock.category.create.mockResolvedValue({
        id: "category-123",
        ...categoryData,
        userId: "db-user-123",
        description: null,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const result = await categoryService.createCategory(
        clerkId,
        categoryData,
      );

      expect(result).toHaveProperty("id", "category-123");
      expect(result.name).toBe("Work");
      expect(result.color).toBe("#4285F4");
      expect(result.icon).toBe("briefcase");

      // Verify the category creation was called with the right data
      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: {
          name: categoryData.name,
          color: categoryData.color,
          icon: categoryData.icon,
          priority: categoryData.priority,
          order: categoryData.order,
          user: {
            connect: {
              clerkId: clerkId,
            },
          },
        },
      });
    });

    test("should throw an error if user does not exist", async () => {
      const clerkId = "nonexistent_user";
      const categoryData = {
        name: "Work",
        color: "#4285F4",
        icon: "briefcase",
        priority: 1,
        order: 1,
      };

      // Mock category creation to throw an error for non-existent user
      prismaMock.category.create.mockImplementation(() => {
        throw new Error(
          "Foreign key constraint failed on the field: `clerkId`",
        );
      });

      await expect(
        categoryService.createCategory(clerkId, categoryData),
      ).rejects.toThrow();
    });
  });

  describe("getCategoryById", () => {
    test("should return a category by id", async () => {
      const categoryId = "category-123";
      const clerkId = "user_123456";

      // Mock the category
      prismaMock.category.findUnique.mockResolvedValue({
        id: categoryId,
        name: "Work",
        color: "#4285F4",
        icon: "briefcase",
        priority: 1,
        order: 1,
        userId: clerkId,
        description: null,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const result = await categoryService.getCategoryById(categoryId, clerkId);

      expect(result).toHaveProperty("id", categoryId);
      expect(result?.name).toBe("Work");

      // Verify that findUnique was called with the right parameters
      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: {
          id: categoryId,
          userId: clerkId,
        },
      });
    });

    test("should return null if category is not found", async () => {
      const categoryId = "nonexistent-category";
      const clerkId = "user_123456";

      // Mock category not found
      prismaMock.category.findUnique.mockResolvedValue(null);

      const result = await categoryService.getCategoryById(categoryId, clerkId);

      expect(result).toBeNull();
    });
  });

  describe("updateCategory", () => {
    test("should update a category successfully", async () => {
      const categoryId = "category-123";
      const clerkId = "user_123456";
      const updateData = {
        name: "Updated Work",
        color: "#34A853",
      };

      // Mock the update
      prismaMock.category.update.mockResolvedValue({
        id: categoryId,
        name: "Updated Work",
        color: "#34A853",
        icon: "briefcase",
        priority: 1,
        order: 1,
        userId: clerkId,
        description: null,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const result = await categoryService.updateCategory(
        categoryId,
        updateData,
        clerkId,
      );

      expect(result.name).toBe("Updated Work");
      expect(result.color).toBe("#34A853");

      // Verify that update was called with the right data
      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: {
          id: categoryId,
          userId: clerkId,
        },
        data: updateData,
      });
    });

    test("should throw an error if category doesn't exist", async () => {
      const categoryId = "nonexistent-category";
      const clerkId = "user_123456";
      const updateData = {
        name: "Updated Work",
      };

      // Mock update to throw for non-existent category
      prismaMock.category.update.mockImplementation(() => {
        throw new Error("Record to update not found");
      });

      await expect(
        categoryService.updateCategory(categoryId, updateData, clerkId),
      ).rejects.toThrow();
    });
  });

  describe("deleteCategory", () => {
    test("should delete a category successfully", async () => {
      const categoryId = "category-123";
      const clerkId = "user_123456";

      // Mock that category is not in use
      prismaMock.task.count.mockResolvedValue(0);
      prismaMock.goal.count.mockResolvedValue(0);

      // Mock the delete operation - need to mock the return value for the await operation
      prismaMock.category.delete.mockResolvedValue({
        id: categoryId,
        name: "Work",
        color: "#4285F4",
        icon: "briefcase",
        priority: 1,
        order: 1,
        userId: clerkId,
        description: null,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      await categoryService.deleteCategory(categoryId, clerkId);

      // Verify correct delete method was called
      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: {
          id: categoryId,
          userId: clerkId,
        },
      });
    });

    test("should throw an error if category is in use", async () => {
      const categoryId = "category-123";
      const clerkId = "user_123456";

      // Mock that category has tasks using it
      prismaMock.task.count.mockResolvedValue(2);
      prismaMock.goal.count.mockResolvedValue(0);

      await expect(
        categoryService.deleteCategory(categoryId, clerkId),
      ).rejects.toThrow(
        "Cannot delete category that is in use by tasks or goals",
      );
    });

    test("should throw an error if category doesn't exist", async () => {
      const categoryId = "nonexistent-category";
      const clerkId = "user_123456";

      // Mock task and goal count to return 0
      prismaMock.task.count.mockResolvedValue(0);
      prismaMock.goal.count.mockResolvedValue(0);

      // Mock category delete to throw
      prismaMock.category.delete.mockImplementation(() => {
        throw new Error("Record to delete not found");
      });

      await expect(
        categoryService.deleteCategory(categoryId, clerkId),
      ).rejects.toThrow();
    });
  });

  describe("getCategoriesByUserId", () => {
    test("should return categories for a user", async () => {
      const clerkId = "user_123456";
      const mockCategories = [
        {
          id: "category-1",
          name: "Work",
          color: "#4285F4",
          icon: "briefcase",
          priority: 1,
          order: 1,
          userId: clerkId,
          description: null,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: "category-2",
          name: "Personal",
          color: "#EA4335",
          icon: "user",
          priority: 2,
          order: 2,
          userId: clerkId,
          description: null,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      // Mock finding user with categories
      prismaMock.user.findUnique.mockResolvedValue({
        categories: mockCategories,
      });

      const result = await categoryService.getCategoriesByUserId(clerkId);

      expect(result).toHaveLength(2);
      expect(result[0]?.name).toBe("Work");
      expect(result[1]?.name).toBe("Personal");

      // Verify the findUnique was called with the right parameters
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { clerkId },
        select: { categories: true },
      });
    });
  });
});
