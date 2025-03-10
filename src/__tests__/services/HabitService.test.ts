import { prismaMock } from "../helpers/mockDb";
import { habitService } from "~/services/habit";

// Mock the HabitSchema
jest.mock("~/types/habit", () => ({
  HabitSchema: {
    parse: jest.fn().mockImplementation((data) => data),
    partial: () => ({
      parse: jest.fn().mockImplementation((data) => data),
    }),
  },
  HabitType: {},
}));

describe("HabitService", () => {
  const mockDate = new Date("2023-01-01T12:00:00Z");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("createHabit", () => {
    test("should create a habit successfully", async () => {
      const habitData = {
        title: "Morning Meditation",
        description: "Meditate for 10 minutes every morning",
        userId: "user_123456",
        categoryId: "category-123",
        targetCompletions: 1,
        active: true,
        color: "#4285F4",
        isCompletedToday: false,
        dailyStreak: 0,
        completedToday: 0,
      };

      // Mock the habit creation
      prismaMock.habit.create.mockResolvedValue({
        id: "habit-123",
        ...habitData,
        createdAt: mockDate,
        updatedAt: mockDate,
        lastCompletedAt: null,
        longestStreak: 0,
        order: 0,
        severity: 1,
        category: {
          id: "category-123",
          name: "Health",
          color: "#4285F4",
          icon: "heart",
          userId: "user_123456",
          description: null,
          createdAt: mockDate,
          updatedAt: mockDate,
          priority: 1,
          order: 1,
        },
      });

      const result = await habitService.createHabit(habitData);

      expect(result).toHaveProperty("id", "habit-123");
      expect(result.title).toBe("Morning Meditation");
      expect(result.description).toBe("Meditate for 10 minutes every morning");

      // Verify that habit creation was called with the right data
      expect(prismaMock.habit.create).toHaveBeenCalledWith({
        data: {
          title: habitData.title,
          description: habitData.description || "",
          userId: habitData.userId,
          categoryId: habitData.categoryId,
          targetCompletions: habitData.targetCompletions,
          active: habitData.active,
          isCompletedToday: habitData.isCompletedToday,
          dailyStreak: habitData.dailyStreak,
          completedToday: habitData.completedToday,
          color: habitData.color,
        },
        include: {
          category: true,
        },
      });
    });

    test("should throw an error if category does not exist", async () => {
      const habitData = {
        title: "Morning Meditation",
        description: "Meditate for 10 minutes every morning",
        userId: "user_123456",
        categoryId: "nonexistent-category",
        targetCompletions: 1,
        active: true,
        color: "#4285F4",
        isCompletedToday: false,
        dailyStreak: 0,
        completedToday: 0,
      };

      // Mock habit creation to throw an error for non-existent category
      prismaMock.habit.create.mockImplementation(() => {
        throw new Error(
          "Foreign key constraint failed on the field: `categoryId`",
        );
      });

      await expect(habitService.createHabit(habitData)).rejects.toThrow();
    });
  });

  describe("getHabitById", () => {
    test("should return a habit by id", async () => {
      const habitId = "habit-123";

      // Mock the habit
      prismaMock.habit.findUnique.mockResolvedValue({
        id: habitId,
        title: "Morning Meditation",
        description: "Meditate for 10 minutes every morning",
        userId: "user_123456",
        categoryId: "category-123",
        targetCompletions: 1,
        active: true,
        isCompletedToday: false,
        dailyStreak: 0,
        lastCompletedAt: null,
        completedToday: 0,
        color: "#4285F4",
        createdAt: mockDate,
        updatedAt: mockDate,
        longestStreak: 0,
        order: 0,
        severity: 1,
        category: {
          id: "category-123",
          name: "Health",
          color: "#4285F4",
          icon: "heart",
          userId: "user_123456",
          description: null,
          createdAt: mockDate,
          updatedAt: mockDate,
          priority: 1,
          order: 1,
        },
      });

      const result = await habitService.getHabitById(habitId);

      expect(result).toHaveProperty("id", habitId);
      expect(result?.title).toBe("Morning Meditation");

      // Verify that findUnique was called with the right parameters
      expect(prismaMock.habit.findUnique).toHaveBeenCalledWith({
        where: {
          id: habitId,
        },
        include: {
          category: true,
        },
      });
    });

    test("should return null if habit is not found", async () => {
      const habitId = "nonexistent-habit";

      // Mock habit not found
      prismaMock.habit.findUnique.mockResolvedValue(null);

      const result = await habitService.getHabitById(habitId);

      expect(result).toBeNull();
    });
  });

  describe("updateHabit", () => {
    test("should update a habit successfully", async () => {
      const habitId = "habit-123";
      const updateData = {
        title: "Updated Meditation",
        description: "Updated description",
      };

      // Mock the update
      prismaMock.habit.update.mockResolvedValue({
        id: habitId,
        title: "Updated Meditation",
        description: "Updated description",
        userId: "user_123456",
        categoryId: "category-123",
        targetCompletions: 1,
        active: true,
        isCompletedToday: false,
        dailyStreak: 0,
        lastCompletedAt: null,
        completedToday: 0,
        color: "#4285F4",
        createdAt: mockDate,
        updatedAt: mockDate,
        longestStreak: 0,
        order: 0,
        severity: 1,
        category: {
          id: "category-123",
          name: "Health",
          color: "#4285F4",
          icon: "heart",
          userId: "user_123456",
          description: null,
          createdAt: mockDate,
          updatedAt: mockDate,
          priority: 1,
          order: 1,
        },
      });

      const result = await habitService.updateHabit(habitId, updateData);

      expect(result.title).toBe("Updated Meditation");
      expect(result.description).toBe("Updated description");

      // Verify that update was called with the right data
      expect(prismaMock.habit.update).toHaveBeenCalledWith({
        where: {
          id: habitId,
        },
        data: updateData,
        include: {
          category: true,
        },
      });
    });

    test("should throw an error if habit doesn't exist", async () => {
      const habitId = "nonexistent-habit";
      const updateData = {
        title: "Updated Meditation",
      };

      // Mock update to throw for non-existent habit
      prismaMock.habit.update.mockImplementation(() => {
        throw new Error("Record to update not found");
      });

      await expect(
        habitService.updateHabit(habitId, updateData),
      ).rejects.toThrow();
    });
  });

  describe("deleteHabit", () => {
    test("should delete a habit successfully", async () => {
      const habitId = "habit-123";

      // Mock the delete operation
      prismaMock.habit.delete.mockResolvedValue({
        id: habitId,
        title: "Morning Meditation",
        description: "Meditate for 10 minutes every morning",
        userId: "user_123456",
        categoryId: "category-123",
        targetCompletions: 1,
        active: true,
        isCompletedToday: false,
        dailyStreak: 0,
        lastCompletedAt: null,
        completedToday: 0,
        color: "#4285F4",
        createdAt: mockDate,
        updatedAt: mockDate,
        longestStreak: 0,
        order: 0,
        severity: 1,
      });

      await habitService.deleteHabit(habitId);

      // Verify correct delete method was called
      expect(prismaMock.habit.delete).toHaveBeenCalledWith({
        where: {
          id: habitId,
        },
      });
    });

    test("should throw an error if habit doesn't exist", async () => {
      const habitId = "nonexistent-habit";

      // Mock habit delete to throw
      prismaMock.habit.delete.mockImplementation(() => {
        throw new Error("Record to delete not found");
      });

      await expect(habitService.deleteHabit(habitId)).rejects.toThrow();
    });
  });

  describe("getHabitsByUserId", () => {
    test("should return habits for a user", async () => {
      const userId = "user_123456";
      const mockHabits = [
        {
          id: "habit-1",
          title: "Morning Meditation",
          description: "Meditate for 10 minutes every morning",
          userId: userId,
          categoryId: "category-123",
          targetCompletions: 1,
          active: true,
          isCompletedToday: false,
          dailyStreak: 0,
          lastCompletedAt: null,
          completedToday: 0,
          color: "#4285F4",
          createdAt: mockDate,
          updatedAt: mockDate,
          longestStreak: 0,
          order: 0,
          severity: 1,
          category: {
            id: "category-123",
            name: "Health",
            color: "#4285F4",
            icon: "heart",
            userId: userId,
            description: null,
            createdAt: mockDate,
            updatedAt: mockDate,
            priority: 1,
            order: 1,
          },
        },
        {
          id: "habit-2",
          title: "Evening Reading",
          description: "Read for 30 minutes before bed",
          userId: userId,
          categoryId: "category-456",
          targetCompletions: 1,
          active: true,
          isCompletedToday: false,
          dailyStreak: 0,
          lastCompletedAt: null,
          completedToday: 0,
          color: "#EA4335",
          createdAt: mockDate,
          updatedAt: mockDate,
          longestStreak: 0,
          order: 0,
          severity: 1,
          category: {
            id: "category-456",
            name: "Personal",
            color: "#EA4335",
            icon: "book",
            userId: userId,
            description: null,
            createdAt: mockDate,
            updatedAt: mockDate,
            priority: 2,
            order: 2,
          },
        },
      ];

      // Mock finding habits
      prismaMock.habit.findMany.mockResolvedValue(mockHabits);

      const result = await habitService.getHabitsByUserId(userId);

      expect(result).toHaveLength(2);
      expect(result[0]?.title).toBe("Morning Meditation");
      expect(result[1]?.title).toBe("Evening Reading");

      // Verify the findMany was called with the right parameters
      expect(prismaMock.habit.findMany).toHaveBeenCalledWith({
        where: {
          userId: userId,
          active: true,
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    test("should return an empty array if the user has no habits", async () => {
      const userId = "user_with_no_habits";

      // Mock finding no habits
      prismaMock.habit.findMany.mockResolvedValue([]);

      const result = await habitService.getHabitsByUserId(userId);

      expect(result).toHaveLength(0);
    });
  });
});
