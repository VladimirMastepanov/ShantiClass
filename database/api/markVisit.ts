import { SQLiteDatabase } from "expo-sqlite";

export const markVisit = async (
  studentId: number,
  visitDate: string,
  hasSubscription: boolean,
  db: SQLiteDatabase
) => {
  try {
    await db.withTransactionAsync(async () => {
      const insertVisitQery =
        "INSERT INTO VisitHistory (studentId, visitDate) VALUES (?, ?);";
      await db.runAsync(insertVisitQery, [studentId, visitDate]);

      if (hasSubscription) {
        const query =
          "UPDATE Students SET paidLessons = paidLessons - 1 WHERE id = ? AND paidLessons > 0;";
        await db.runAsync(query, [studentId]);
      }

      const updateQuery = hasSubscription
        ? `UPDATE VisitStatistic SET signed = signed + 1 WHERE date = ?;`
        : `UPDATE VisitStatistic SET unsigned = unsigned + 1 WHERE date = ?;`;

      try {
        await db.runAsync(updateQuery, [visitDate]);
      } catch (e) {
        try {
          const insertValue = hasSubscription
            ? { signed: 1, unsigned: 0 }
            : { signed: 0, unsigned: 1 };
          const insertQuery =
            "INSERT INTO VisitStatistic (date, signed, unsigned) VALUES (?, ?, ?);";
          await db.runAsync(insertQuery, [
            visitDate,
            insertValue.signed,
            insertValue.unsigned,
          ]);
        } catch (err) {
          console.error("Ошибка создания новой записи визита студента:", err);
        }
      }
    });
  } catch (err) {
    console.error("Ошибка заполнения визита студента: ", err);
  }
};
