import { SQLiteDatabase } from "expo-sqlite";
import { updateStudentSubscription } from "./updateStudentSubscription";

export const unmarkVisit = async (
  studentId: number,
  visitDate: string, // формат "YYYY-MM-DD"
  db: SQLiteDatabase
): Promise<void> => {
  try {
    await db.withTransactionAsync(async () => {
      const result = await db.getFirstAsync<{ deducted: number }>(
        "SELECT deducted FROM VisitHistory WHERE studentId = ? AND visitDate = ?;",
        [studentId, visitDate]
      );

      if (!result || result.deducted === undefined) {
        return;
      }

      const deducted = result.deducted;

      if (deducted === 1) {
        await db.runAsync(
          "UPDATE Students SET paidLessons = paidLessons + 1 WHERE id = ?;",
          [studentId]
        );
      }

      await db.runAsync(
        "DELETE FROM VisitHistory WHERE studentId = ? AND visitDate = ?;",
        [studentId, visitDate]
      );

      const fieldToUpdate = deducted === 1 ? "signed" : "unsigned";
      await db.runAsync(
        `UPDATE VisitStatistic SET ${fieldToUpdate} = ${fieldToUpdate} - 1 WHERE date = ?;`,
        [visitDate]
      );

      await db.runAsync(
        "DELETE FROM VisitStatistic WHERE date = ? AND signed = 0 AND unsigned = 0;",
        [visitDate]
      );
      await updateStudentSubscription(studentId, db);
    });
  } catch (err) {
    console.error("Ошибка отмены посещения студента:", err);
  }
};
