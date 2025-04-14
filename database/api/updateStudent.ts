import { SQLiteDatabase } from "expo-sqlite";
import { StudentsDescription } from "../../types/dbTypes";

export const updateStudent = async (
  db: SQLiteDatabase,
  student: StudentsDescription
) => {
  const query = `
        UPDATE Students
        SET 
          name = ?,
          instagram = ?,
          hasSubscription = ?, 
          startSubscription = ?, 
          paidLessons = ?, 
          additional = ?
        WHERE id = ?
        `;

  const value = [
    student.name,
    student.instagram,
    student.hasSubscription,
    student.startSubscription,
    student.paidLessons,
    student.additional,
    student.id,
  ];

  try {
    await db.runAsync(query, value);
  } catch (e) {
    console.error("error updating student:", e);
  }
};
