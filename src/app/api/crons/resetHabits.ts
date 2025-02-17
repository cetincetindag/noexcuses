import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '~/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST' && req.headers['authorization'] === `Bearer ${process.env.CRON_SECRET}`) {
    try {
      await db.$transaction(async (prisma) => {
        await prisma.habit.updateMany({
          where: {
            isCompletedToday: true,
          },
          data: {
            isCompletedToday: false,
          },
        });

        await prisma.habit.updateMany({
          where: {
            isCompletedToday: false,
          },
          data: {
            dailyStreak: 0,
          },
        });
      });

      res.status(200).json({ message: 'Habits reset successfully' });
    } catch (error) {
      console.error('Error resetting habits:', error);
      res.status(500).json({ message: 'Failed to reset habits' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
