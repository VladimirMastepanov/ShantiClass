import { SQLiteDatabase } from "expo-sqlite";
import { updateStudentSubscription } from "./updateStudentSubscription";

export const unmarkVisit = async (
  studentId: number,
  visitDate: string, // формат "YYYY-MM-DD"
  db: SQLiteDatabase
): Promise<void> => {
  try {
    await db.withTransactionAsync(async () => {
      // 1. Получаем запись VisitHistory для данного студента и даты
      const result = await db.getFirstAsync<{ deducted: number }>(
        "SELECT deducted FROM VisitHistory WHERE studentId = ? AND visitDate = ?;",
        [studentId, visitDate]
      );

      if (!result || result.deducted === undefined) {
        console.error("Нет записи VisitHistory для отмены посещения.");
        return;
      }

      const deducted = result.deducted; // ожидается 1 или 0

      // 2. Если списание прошло, возвращаем оплаченный урок
      if (deducted === 1) {
        await db.runAsync(
          "UPDATE Students SET paidLessons = paidLessons + 1 WHERE id = ?;",
          [studentId]
        );
      }

      // 3. Удаляем запись посещения из VisitHistory
      await db.runAsync(
        "DELETE FROM VisitHistory WHERE studentId = ? AND visitDate = ?;",
        [studentId, visitDate]
      );

      // 4. Обновляем статистику посещений: уменьшаем соответствующий счётчик
      const fieldToUpdate = deducted === 1 ? "signed" : "unsigned";
      await db.runAsync(
        `UPDATE VisitStatistic SET ${fieldToUpdate} = ${fieldToUpdate} - 1 WHERE date = ?;`,
        [visitDate]
      );

      // 5. Если после обновления статистики оба поля равны 0, удаляем запись
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
