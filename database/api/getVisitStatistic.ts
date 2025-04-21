import { SQLiteDatabase } from "expo-sqlite";
import { StatisticDescription, StatisticFromDb } from "../../types/dbTypes";

export const getVisitStatistic = async (
  db: SQLiteDatabase
): Promise<StatisticDescription[]> => {
  try {
    const statisticQuery = `SELECT VisitHistory.visitDate, 
             SUM(CASE WHEN Students.hasSubscription = 1 THEN 1 ELSE 0 END) AS signed,
             SUM(CASE WHEN Students.hasSubscription = 0 THEN 1 ELSE 0 END) AS unsigned
      FROM VisitHistory
      JOIN Students ON VisitHistory.studentId = Students.id
      GROUP BY VisitHistory.visitDate
      ORDER BY VisitHistory.visitDate DESC;`;

    const result = await db.getAllAsync<StatisticFromDb>(statisticQuery);
    if (result) {
      return result.map((r) => ({
        visitDate: r.visitDate,
        signed: r.signed || 0,
        unsigned: r.unsigned || 0,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching visit statistic:", error);
    return [];
  }
};
