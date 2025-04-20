import { SQLiteDatabase } from "expo-sqlite";
import { VisitDescription } from "../../types/dbTypes";

export const getVisitStatisticsForDate = async (
  date: string,
  db: SQLiteDatabase
): Promise<VisitDescription> => {
  const defaultStatistic = {
    visitors: 0,
    subscribers: 0,
    unSubscribers: 0,
  };
  console.error('getVisitStatisticsForDate date:', date)
  try {
    const statisticQuery = `SELECT (signed + unsigned) as visitors,
        signed as subscribers,
        unsigned as unSubscribers
      FROM VisitStatistic
      WHERE date = ?;`;

    const statistic = await db.getFirstAsync<VisitDescription>(statisticQuery, [
      date,
    ]);
    if (!statistic) {
      return defaultStatistic;
    }

    console.error('getVisitStatisticsForDate statistic:', statistic)
    return statistic;
  } catch (err) {
    console.error("Ошибка при получении статистики посещений:", err);
    return defaultStatistic;
  }
};
