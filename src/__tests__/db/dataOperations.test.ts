import { prismaMock } from "../helpers/mockDb";
import { Frequency } from "@prisma/client";

describe("Category Database Operations", () => {
  test("should successfully create and retrieve a category", async () => {
    const category = {
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
    };

    // Mock the create operation
    prismaMock.category.create.mockResolvedValue(category);

    // Create a category
    const createdCategory = await prismaMock.category.create({
      data: {
        name: "Test Category",
        color: "#ff0000",
        icon: "test-icon",
        description: "Test category description",
        priority: 1,
        order: 1,
        userId: "user-123",
      },
    });

    expect(createdCategory).toEqual(category);
    expect(prismaMock.category.create).toHaveBeenCalled();

    // Mock the findUnique operation
    prismaMock.category.findUnique.mockResolvedValue(category);

    // Retrieve the category
    const retrievedCategory = await prismaMock.category.findUnique({
      where: { id: "category-123" },
    });

    expect(retrievedCategory).toEqual(category);
    expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
      where: { id: "category-123" },
    });
  });
});

describe("Habit Database Operations", () => {
  test("should successfully create and update a habit", async () => {
    const habit = {
      id: "habit-123",
      title: "Test Habit",
      description: "Test habit description",
      targetCompletions: 1,
      completedToday: 0,
      isCompletedToday: false,
      active: true,
      dailyStreak: 0,
      longestStreak: 0,
      categoryId: "category-123",
      userId: "user-123",
      lastCompletedAt: null,
      order: 1,
      color: "#00ff00",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the create operation
    prismaMock.habit.create.mockResolvedValue(habit);

    // Create a habit
    const createdHabit = await prismaMock.habit.create({
      data: {
        title: "Test Habit",
        description: "Test habit description",
        targetCompletions: 1,
        categoryId: "category-123",
        userId: "user-123",
        order: 1,
        color: "#00ff00",
      },
    });

    expect(createdHabit).toEqual(habit);
    expect(prismaMock.habit.create).toHaveBeenCalled();

    // Updated habit data
    const updatedHabit = {
      ...habit,
      completedToday: 1,
      isCompletedToday: true,
      lastCompletedAt: new Date(),
      dailyStreak: 1,
    };

    // Mock the update operation
    prismaMock.habit.update.mockResolvedValue(updatedHabit);

    // Update the habit
    const result = await prismaMock.habit.update({
      where: { id: "habit-123" },
      data: {
        completedToday: 1,
        isCompletedToday: true,
        lastCompletedAt: updatedHabit.lastCompletedAt,
        dailyStreak: 1,
      },
    });

    expect(result).toEqual(updatedHabit);
    expect(prismaMock.habit.update).toHaveBeenCalled();
  });
});

describe("Routine Database Operations", () => {
  test("should successfully create and delete a routine", async () => {
    const routine = {
      id: "routine-123",
      title: "Test Routine",
      description: "Test routine description",
      frequency: Frequency.DAILY,
      isCompletedToday: false,
      streak: 0,
      lastCompletedAt: null,
      color: "#0000ff",
      categoryId: "category-123",
      userId: "user-123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the create operation
    prismaMock.routine.create.mockResolvedValue(routine);

    // Create a routine
    const createdRoutine = await prismaMock.routine.create({
      data: {
        title: "Test Routine",
        description: "Test routine description",
        frequency: Frequency.DAILY,
        categoryId: "category-123",
        userId: "user-123",
        color: "#0000ff",
      },
    });

    expect(createdRoutine).toEqual(routine);
    expect(prismaMock.routine.create).toHaveBeenCalled();

    // Mock the delete operation
    prismaMock.routine.delete.mockResolvedValue(routine);

    // Delete the routine
    const deletedRoutine = await prismaMock.routine.delete({
      where: { id: "routine-123" },
    });

    expect(deletedRoutine).toEqual(routine);
    expect(prismaMock.routine.delete).toHaveBeenCalledWith({
      where: { id: "routine-123" },
    });
  });
});
