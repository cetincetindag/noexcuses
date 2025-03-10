import { prismaMock } from "../helpers/mockDb";
import { taskService } from "~/services/task";
import { Frequency } from "@prisma/client";

// Import the TaskSchema if it's used in the service
jest.mock("~/types/task", () => ({
  TaskSchema: {
    parse: jest.fn().mockImplementation((data) => data),
  },
  TaskType: {},
}));

describe("TaskService", () => {
  describe("createTask", () => {
    test("should create a task successfully", async () => {
      // Mock data for a new task with all required properties
      const taskData = {
        title: "New Test Task",
        description: "This is a test task",
        priority: 1,
        frequency: Frequency.DAILY,
        categoryId: "category-123",
        userId: "user-123",
        order: 0,
        completed: false,
        dailyStreak: 0,
        weeklyStreak: 0,
        monthlyStreak: 0,
        isCompletedToday: false,
        lastCompletedAt: null,
        isRecurring: false,
        dueDate: null,
      };

      // Mock the category check
      prismaMock.category.findUnique.mockResolvedValue({
        id: "category-123",
        name: "Test Category",
        color: "#ff0000",
        icon: "test-icon",
        description: "Test category description",
        priority: 1,
        order: 1,
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Mock the task creation
      prismaMock.task.create.mockResolvedValue({
        id: "task-123",
        title: "New Test Task",
        description: "This is a test task",
        priority: 1,
        frequency: Frequency.DAILY,
        order: 1,
        completed: false,
        isCompletedToday: false,
        lastCompletedAt: null,
        dailyStreak: 0,
        weeklyStreak: 0,
        monthlyStreak: 0,
        categoryId: "category-123",
        userId: "user-123",
        repeatConfig: null,
        nextDueDate: null,
        isRecurring: false,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Call the service method
      const result = await taskService.createTask(taskData);

      // Assert the result
      expect(result).toHaveProperty("id", "task-123");
      expect(result.title).toBe("New Test Task");
      expect(result.description).toBe("This is a test task");
      expect(result.categoryId).toBe("category-123");
      expect(result.userId).toBe("user-123");

      // Verify that the category check was called
      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id: "category-123" },
      });

      // Verify that task creation was called with the right data
      expect(prismaMock.task.create).toHaveBeenCalled();
    });

    test("should throw an error if category does not exist", async () => {
      // Mock data for a new task with all required properties
      const taskData = {
        title: "New Test Task",
        description: "This is a test task",
        priority: 1,
        frequency: Frequency.DAILY,
        categoryId: "non-existent-category",
        userId: "user-123",
        order: 0,
        completed: false,
        dailyStreak: 0,
        weeklyStreak: 0,
        monthlyStreak: 0,
        isCompletedToday: false,
        lastCompletedAt: null,
        isRecurring: false,
        dueDate: null,
      };

      // Mock the category check to return null (category not found)
      prismaMock.category.findUnique.mockResolvedValue(null);

      // Call the service method and expect it to throw
      await expect(taskService.createTask(taskData)).rejects.toThrow(
        `Category with ID ${taskData.categoryId} not found`,
      );

      // Verify that the category check was called
      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id: "non-existent-category" },
      });

      // Verify that task creation was not called
      expect(prismaMock.task.create).not.toHaveBeenCalled();
    });

    test("should throw an error if userId is missing", async () => {
      // Mock data for a new task without userId
      const taskData = {
        title: "New Test Task",
        description: "This is a test task",
        priority: 1,
        frequency: Frequency.DAILY,
        categoryId: "category-123",
        userId: "", // Empty user ID
        order: 0,
        completed: false,
        dailyStreak: 0,
        weeklyStreak: 0,
        monthlyStreak: 0,
        isCompletedToday: false,
        lastCompletedAt: null,
        isRecurring: false,
        dueDate: null,
      };

      // Call the service method and expect it to throw
      await expect(taskService.createTask(taskData)).rejects.toThrow(
        "User ID is required",
      );

      // Verify that the category check was not called
      expect(prismaMock.category.findUnique).not.toHaveBeenCalled();

      // Verify that task creation was not called
      expect(prismaMock.task.create).not.toHaveBeenCalled();
    });
  });
});
