import { SQLiteDatabase } from "expo-sqlite";
import { updateStudentSubscription } from "./updateStudentSubscription";

export const markVisit = async (
  studentId: number,
  visitDate: string,
  hasSubscription: number | null,
  db: SQLiteDatabase
) => {
  try {
    console.error("markVisit, visitDate:", visitDate);
    await db.withTransactionAsync(async () => {
      let deducted = 0;

      if (hasSubscription === 1) {
        const query =
          "UPDATE Students SET paidLessons = paidLessons - 1 WHERE id = ? AND paidLessons > 0;";
        const updateRes = await db.runAsync(query, [studentId]);
        deducted = updateRes.changes > 0 ? 1 : 0;
        // console.error("updateRes.changes:", updateRes.changes);
        // console.error("deducted:", deducted);
      }

      await updateStudentSubscription(studentId, db);

      const insertVisitQuery =
        "INSERT INTO VisitHistory (studentId, visitDate, deducted) VALUES (?, ?, ?);";
      const insertVisitRTes = await db.runAsync(insertVisitQuery, [
        studentId,
        visitDate,
        deducted,
      ]);
      // console.error("markVisit insertVisitRTes:", insertVisitRTes.changes);
      const updateQuery =
        hasSubscription === 1
          ? `UPDATE VisitStatistic SET signed = signed + 1 WHERE date = ?;`
          : `UPDATE VisitStatistic SET unsigned = unsigned + 1 WHERE date = ?;`;

      const updateRes = await db.runAsync(updateQuery, [visitDate]);

      if (updateRes.changes === 0) {
        const insertValue =
          hasSubscription === 1
            ? { signed: 1, unsigned: 0 }
            : { signed: 0, unsigned: 1 };
        const insertQuery =
          "INSERT INTO VisitStatistic (date, signed, unsigned) VALUES (?, ?, ?);";
        await db.runAsync(insertQuery, [
          visitDate,
          insertValue.signed,
          insertValue.unsigned,
        ]);
      }
    });
  } catch (err) {
    console.error("Ошибка заполнения визита студента: ", err);
  }
};
