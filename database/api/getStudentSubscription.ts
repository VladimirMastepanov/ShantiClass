import { SQLiteDatabase } from "expo-sqlite";

export const getStudentSubscription = async (
  studentId: number,
  db: SQLiteDatabase
): Promise<number | undefined> => {
  try {
    const query = "SELECT hasSubscription FROM Students WHERE id = ?;";
    const res = await db.getFirstAsync<{ hasSubscription: number }>(query, [
      studentId,
    ]);

    return res?.hasSubscription;
  } catch (error) {
    console.error("Error fetching students data:", error);
  }
};
