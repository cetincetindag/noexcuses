import { db } from '~/server/db';
import { userDataType } from '~/types/user';

export class UserService {
  async checkUsernameExists(username: string) {
    const existingUser = await db.user.findUnique({
      where: { username },
    });
    return !!existingUser;
  }

  async createUser(data: userDataType) {
    return await db.user.create({
      data: {
        username: data.username,
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
}

