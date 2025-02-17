import { db } from '~/server/db';
import { userDataType } from '~/types/user';
import { clerkClient } from '@clerk/nextjs/server';

class UserService {

  async checkUsernameExists(username: string) {
    const existingUser = await db.user.findUnique({
      where: { username },
    });
    return !!existingUser;
  }

  async returnUsername(clerkId: string) {
    const user = await db.user.findUniqueOrThrow({
      where: { clerkId },
      select: {
        username: true
      }
    })
    return user.username;
  }

  async createUser(data: userDataType) {
    return await db.user.create({
      data: {
        username: data.username,
        clerkId: data.clerkId,
        weightUnit: data.weightUnit,
        heightUnit: data.heightUnit,
        weight: data.weight,
        height: data.height,
        startData: {
          create: {
            dailyWeightTraining: data.startData.dailyWeightTraining,
            dailyCardio: data.startData.dailyCardio,
            dailyMeditation: data.startData.dailyMeditation,
            dailyWaterIntake: data.startData.dailyWaterIntake,
          },
        },
      },
    });
  }


  async deleteUser(userId: string) {
    try {
      const client = await clerkClient();
      await client.users.deleteUser(userId)
      return await db.user.delete({
        where: {
          id: userId
        }
      })
    } catch (e) {
      console.error("Failed to delete user: ", e)
    }
  }

  async updateUser(userId: string, data: Object) {
    return await db.user.update({
      where: {
        id: userId
      },
      data: {
        ...data
      }
    })
  }
}

export const userService = new UserService();

