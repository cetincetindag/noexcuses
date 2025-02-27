import { db } from '~/server/db';
import { habitDataType } from '~/types/habit'; // Assuming you have a type for habitDataType

class HabitService {
  
  async getAllHabits() {
    return await db.habit.findMany({
      include: {
        User: true, // Include user data if needed
      },
    });
  }

  async getHabitById(habitId: number) {
    return await db.habit.findUnique({
      where: { id: habitId },
    });
  }

  async createHabit(data: habitDataType) {
    return await db.habit.create({
      data: {
        title: data.title,
        category: data.category,
        units: data.units,
        customUnit: data.customUnit || "",
        amountRequired: data.amountRequired,
        amountDone: data.amountDone,
        userId: data.userId,
      },
    });
  }

  async updateHabit(habitId: number, data: Partial<habitDataType>) {
    return await db.habit.update({
      where: { id: habitId },
      data: {
        ...data,
      },
    });
  }

  async deleteHabit(habitId: number) {
    return await db.habit.delete({
      where: { id: habitId },
    });
  }
}

export const habitService = new HabitService(); 