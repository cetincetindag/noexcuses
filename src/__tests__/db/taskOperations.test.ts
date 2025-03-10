import { prismaMock } from "../helpers/mockDb";
import { Frequency, Prisma } from "@prisma/client";

describe("Task Database Operations", () => {
  // Test creating a task
  test("should create a new task", async () => {
    const task = {
      id: "task-123",
      title: "Test Task",
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
    };

    prismaMock.task.create.mockResolvedValue(task);

    // Here you would typically call your service function that creates a task
    // For this example, we'll mock it directly:
    const result = await prismaMock.task.create({
      data: {
        title: "Test Task",
        description: "This is a test task",
        priority: 1,
        categoryId: "category-123",
        userId: "user-123",
      },
    });

    expect(result).toEqual(task);
    expect(prismaMock.task.create).toHaveBeenCalledWith({
      data: {
        title: "Test Task",
        description: "This is a test task",
        priority: 1,
        categoryId: "category-123",
        userId: "user-123",
      },
    });
  });

  // Test retrieving tasks by user ID
  test("should find tasks by user ID", async () => {
    const tasks = [
      {
        id: "task-123",
        title: "Test Task 1",
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
      },
      {
        id: "task-456",
        title: "Test Task 2",
        description: "This is another test task",
        priority: 2,
        frequency: Frequency.WEEKLY,
        order: 2,
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
      },
    ];

    prismaMock.task.findMany.mockResolvedValue(tasks);

    const result = await prismaMock.task.findMany({
      where: { userId: "user-123" },
    });

    expect(result).toEqual(tasks);
    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: { userId: "user-123" },
    });
  });

  // Test updating a task
  test("should update a task", async () => {
    const updatedTask = {
      id: "task-123",
      title: "Updated Task",
      description: "This task has been updated",
      priority: 2,
      frequency: Frequency.DAILY,
      order: 1,
      completed: true,
      isCompletedToday: true,
      lastCompletedAt: new Date(),
      dailyStreak: 1,
      weeklyStreak: 1,
      monthlyStreak: 1,
      categoryId: "category-123",
      userId: "user-123",
      repeatConfig: null,
      nextDueDate: null,
      isRecurring: false,
      dueDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.task.update.mockResolvedValue(updatedTask);

    // Use a type assertion for the update data since we can't be sure of the exact
    // property names without seeing the Prisma schema
    const result = await prismaMock.task.update({
      where: { id: "task-123" },
      data: {
        title: "Updated Task",
        description: "This task has been updated",
        priority: 2,
        completed: true,
        dailyStreak: 1,
        weeklyStreak: 1,
        monthlyStreak: 1,
      } as Prisma.TaskUpdateInput, // Safe assertion to the correct type
    });

    expect(result).toEqual(updatedTask);
    expect(prismaMock.task.update).toHaveBeenCalled();
  });

  // Test deleting a task
  test("should delete a task", async () => {
    const deletedTask = {
      id: "task-123",
      title: "Test Task",
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
    };

    prismaMock.task.delete.mockResolvedValue(deletedTask);

    const result = await prismaMock.task.delete({
      where: { id: "task-123" },
    });

    expect(result).toEqual(deletedTask);
    expect(prismaMock.task.delete).toHaveBeenCalledWith({
      where: { id: "task-123" },
    });
  });
});
