import { SQLiteDatabase } from "expo-sqlite";
import { dateToYYMMDD } from "../../utilities/dateToYYMMDD";

export const getStudentVisitDates = async (
  studentId: number,
  db: SQLiteDatabase
): Promise<string[]> => {
  try {
    const query =
      "SELECT visitDate FROM VisitHistory WHERE studentId = ? ORDER BY visitDate ASC;";
    const res = await db.getAllAsync<{ visitDate: string }>(query, [studentId]);
    if (!res || res.length === 0) {
      console.log("Student visit Dates - []");
      return [];
    }
    const dates = res.map((el) => dateToYYMMDD(el.visitDate));
    return dates;
  } catch (error) {
    console.error("Error fetching students data:", error);
    return [];
  }
};
