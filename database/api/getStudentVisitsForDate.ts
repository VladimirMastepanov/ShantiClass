import { SQLiteDatabase } from "expo-sqlite";
import { StudentsMarksType } from "../../types/dbTypes";

export const getStudentVisitsForDate = async (
  date: string,
  db: SQLiteDatabase
): Promise<StudentsMarksType> => {
  try {
    const visitsQuery = `SELECT studentId FROM VisitHistory WHERE visitDate = ?;`;

    const visits = await db.getAllAsync<{ studentId: number }>(visitsQuery, [
      date,
    ]);

    const studentsMarks: StudentsMarksType = {};
    visits.forEach((el) => {
      studentsMarks[el.studentId.toString()] = true;
    });
    
    return studentsMarks;
  } catch (err) {
    console.error("Ошибка при получении данных о посещениях:", err);
    return {};
  }
};
