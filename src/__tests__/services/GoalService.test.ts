import { prismaMock } from "../helpers/mockDb";
import { goalService } from "~/services/goal";
import { Frequency } from "@prisma/client";

// Mock the GoalSchema
jest.mock("~/types/goal", () => ({
  GoalSchema: {
    parse: jest.fn().mockImplementation((data) => data),
    partial: () => ({
      parse: jest.fn().mockImplementation((data) => data),
    }),
  },
  GoalType: {},
}));

describe("GoalService", () => {
  const mockDate = new Date("2023-01-01T12:00:00Z");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("createGoal", () => {
    test("should create a goal successfully", async () => {
      // Mock data for a new goal
      const goalData = {
        title: "Learn TypeScript",
        description: "Master TypeScript fundamentals",
        priority: 1,
        frequency: Frequency.ONCE,
        categoryId: "category-123",
        userId: "user-123",
        order: 1,
        progress: 0,
        total: 100,
        completed: false,
        isCompletedToday: false,
        dailyStreak: 0,
        weeklyStreak: 0,
        monthlyStreak: 0,
        dueDate: new Date("2023-12-31"),
      };

      // Mock the goal creation
      prismaMock.goal.create.mockResolvedValue({
        id: "goal-123",
        ...goalData,
        taskId: null,
        lastCompletedAt: null,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      // Call the service method
      const result = await goalService.createGoal(goalData);

      // Assert the result
      expect(result).toHaveProperty("id", "goal-123");
      expect(result.title).toBe("Learn TypeScript");
      expect(result.description).toBe("Master TypeScript fundamentals");
      expect(result.categoryId).toBe("category-123");
      expect(result.userId).toBe("user-123");

      // Verify that goal creation was called with the right data
      expect(prismaMock.goal.create).toHaveBeenCalledWith({
        data: goalData,
        include: {
          category: true,
          task: true,
        },
      });
    });

    test("should throw an error if categoryId is invalid", async () => {
      // Mock data with non-existent category
      const goalData = {
        title: "Learn TypeScript",
        description: "Master TypeScript fundamentals",
        priority: 1,
        frequency: Frequency.ONCE,
        categoryId: "non-existent-category",
        userId: "user-123",
        order: 1,
        progress: 0,
        total: 100,
        completed: false,
        isCompletedToday: false,
        dailyStreak: 0,
        weeklyStreak: 0,
        monthlyStreak: 0,
        dueDate: new Date("2023-12-31"),
      };

      // Mock the category check to return null
      prismaMock.category.findUnique.mockResolvedValue(null);

      // Call the service method and expect it to throw
      await expect(goalService.createGoal(goalData)).rejects.toThrow();

      // Verify that goal creation was not called
      expect(prismaMock.goal.create).not.toHaveBeenCalled();
    });

    test("should throw an error if userId is missing", async () => {
      // Mock data for a new goal without userId
      const goalData = {
        title: "Learn TypeScript",
        description: "Master TypeScript fundamentals",
        priority: 1,
        frequency: Frequency.ONCE,
        categoryId: "category-123",
        userId: "",
        order: 1,
        progress: 0,
        total: 100,
        completed: false,
        isCompletedToday: false,
        dailyStreak: 0,
        weeklyStreak: 0,
        monthlyStreak: 0,
        dueDate: new Date("2023-12-31"),
      };

      // Call the service method and expect it to throw
      await expect(goalService.createGoal(goalData)).rejects.toThrow(
        "User ID is required",
      );

      // Verify that the category check was not called
      expect(prismaMock.category.findUnique).not.toHaveBeenCalled();

      // Verify that goal creation was not called
      expect(prismaMock.goal.create).not.toHaveBeenCalled();
    });
  });

  describe("getGoalById", () => {
    test("should return a goal by id", async () => {
      const mockGoal = {
        id: "goal-123",
        title: "Learn TypeScript",
        description: "Master TypeScript fundamentals",
        priority: 1,
        taskId: null,
        frequency: Frequency.ONCE,
        categoryId: "category-123",
        userId: "user-123",
        order: 1,
        progress: 0,
        total: 100,
        completed: false,
        isCompletedToday: false,
        dailyStreak: 0,
        weeklyStreak: 0,
        monthlyStreak: 0,
        lastCompletedAt: null,
        dueDate: new Date("2023-12-31"),
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      prismaMock.goal.findUnique.mockResolvedValue(mockGoal);

      const result = await goalService.getGoalById("goal-123", "user-123");

      expect(result).toEqual(mockGoal);
      expect(prismaMock.goal.findUnique).toHaveBeenCalledWith({
        where: {
          id: "goal-123",
          userId: "user-123",
        },
        include: {
          category: true,
          task: true,
        },
      });
    });

    test("should return null for non-existent goal", async () => {
      prismaMock.goal.findUnique.mockResolvedValue(null);

      const result = await goalService.getGoalById(
        "non-existent-goal",
        "user-123",
      );

      expect(result).toBeNull();
      expect(prismaMock.goal.findUnique).toHaveBeenCalledWith({
        where: {
          id: "non-existent-goal",
          userId: "user-123",
        },
        include: {
          category: true,
          task: true,
        },
      });
    });
  });

  describe("updateGoal", () => {
    test("should update a goal successfully", async () => {
      const goalId = "goal-123";
      const userId = "user-123";
      const updateData = {
        title: "Master TypeScript",
        progress: 25,
      };

      // Mock the update operation
      prismaMock.goal.update.mockResolvedValue({
        id: goalId,
        title: "Master TypeScript",
        description: "Master TypeScript fundamentals",
        priority: 1,
        taskId: null,
        frequency: Frequency.ONCE,
        categoryId: "category-123",
        userId: userId,
        order: 1,
        progress: 25,
        total: 100,
        completed: false,
        isCompletedToday: false,
        dailyStreak: 0,
        weeklyStreak: 0,
        monthlyStreak: 0,
        lastCompletedAt: null,
        dueDate: new Date("2023-12-31"),
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const result = await goalService.updateGoal(goalId, updateData, userId);

      expect(result.title).toBe("Master TypeScript");
      expect(result.progress).toBe(25);
      expect(prismaMock.goal.update).toHaveBeenCalledWith({
        where: { id: goalId, userId },
        data: updateData,
        include: {
          category: true,
          task: true,
        },
      });
    });

    test("should throw an error if goal doesn't exist", async () => {
      prismaMock.goal.findUnique.mockResolvedValue(null);

      await expect(
        goalService.updateGoal(
          "non-existent-goal",
          { title: "New Title" },
          "user-123",
        ),
      ).rejects.toThrow();

      expect(prismaMock.goal.update).not.toHaveBeenCalled();
    });

    test("should set completed to true when progress is 100", async () => {
      const goalId = "goal-123";
      const userId = "user-123";
      const updateData = {
        progress: 100,
      };

      // Mock the update operation
      prismaMock.goal.update.mockResolvedValue({
        id: goalId,
        title: "Learn TypeScript",
        description: "Master TypeScript fundamentals",
        priority: 1,
        taskId: null,
        frequency: Frequency.ONCE,
        categoryId: "category-123",
        userId: userId,
        order: 1,
        progress: 100,
        total: 100,
        completed: true,
        isCompletedToday: true,
        dailyStreak: 1,
        weeklyStreak: 1,
        monthlyStreak: 1,
        lastCompletedAt: mockDate,
        dueDate: new Date("2023-12-31"),
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const result = await goalService.updateGoal(goalId, updateData, userId);

      expect(result.progress).toBe(100);
      expect(result.completed).toBe(true);
      expect(prismaMock.goal.update).toHaveBeenCalledWith({
        where: { id: goalId, userId },
        data: updateData,
        include: {
          category: true,
          task: true,
        },
      });
    });
  });

  describe("deleteGoal", () => {
    test("should delete a goal successfully", async () => {
      const goalId = "goal-123";
      const userId = "user-123";

      // Mock the delete operation
      prismaMock.goal.delete.mockResolvedValue({
        id: goalId,
        title: "Learn TypeScript",
        description: "Master TypeScript fundamentals",
        priority: 1,
        taskId: null,
        frequency: Frequency.ONCE,
        categoryId: "category-123",
        userId: userId,
        order: 1,
        progress: 0,
        total: 100,
        completed: false,
        isCompletedToday: false,
        dailyStreak: 0,
        weeklyStreak: 0,
        monthlyStreak: 0,
        lastCompletedAt: null,
        dueDate: new Date("2023-12-31"),
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      await goalService.deleteGoal(goalId, userId);

      // Verify that the delete operation was called
      expect(prismaMock.goal.delete).toHaveBeenCalledWith({
        where: { id: goalId, userId },
      });
    });

    test("should throw an error if goal doesn't exist", async () => {
      prismaMock.goal.findUnique.mockResolvedValue(null);

      await expect(
        goalService.deleteGoal("non-existent-goal", "user-123"),
      ).rejects.toThrow();

      expect(prismaMock.goal.delete).not.toHaveBeenCalled();
    });
  });

  describe("getGoalsByUserId", () => {
    test("should return all goals for a user", async () => {
      const userId = "user-123";
      const mockGoals = [
        {
          id: "goal-1",
          title: "Learn TypeScript",
          description: "Master TypeScript fundamentals",
          priority: 1,
          taskId: null,
          frequency: Frequency.ONCE,
          categoryId: "category-123",
          userId,
          order: 1,
          progress: 0,
          total: 100,
          completed: false,
          isCompletedToday: false,
          dailyStreak: 0,
          weeklyStreak: 0,
          monthlyStreak: 0,
          lastCompletedAt: null,
          dueDate: new Date("2023-12-31"),
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: "goal-2",
          title: "Learn React",
          description: "Master React fundamentals",
          priority: 1,
          taskId: null,
          frequency: Frequency.ONCE,
          categoryId: "category-123",
          userId,
          order: 2,
          progress: 50,
          total: 100,
          completed: false,
          isCompletedToday: false,
          dailyStreak: 0,
          weeklyStreak: 0,
          monthlyStreak: 0,
          lastCompletedAt: null,
          dueDate: new Date("2023-11-30"),
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      prismaMock.goal.findMany.mockResolvedValue(mockGoals);

      const result = await goalService.getGoalsByUserId(userId);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Learn TypeScript");
      expect(result[1].title).toBe("Learn React");
      expect(prismaMock.goal.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { order: "asc" },
        include: {
          category: true,
          task: true,
        },
      });
    });

    test("should return empty array if no goals found", async () => {
      const userId = "user-with-no-goals";

      prismaMock.goal.findMany.mockResolvedValue([]);

      const result = await goalService.getGoalsByUserId(userId);

      expect(result).toEqual([]);
      expect(prismaMock.goal.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { order: "asc" },
        include: {
          category: true,
          task: true,
        },
      });
    });
  });
});
