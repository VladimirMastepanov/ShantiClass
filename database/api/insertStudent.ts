import { SQLiteDatabase } from "expo-sqlite";
import { NewStudentDescription } from "../../types/dbTypes";

export const insertStudent = async (
  db: SQLiteDatabase,
  student: NewStudentDescription
) => {
  const query = `
        INSERT OR IGNORE INTO Students (
        name, instagram, hasSubscription, startSubscription, paidLessons, additional, history
        ) VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

  const value = [
    student.name,
    student.instagram,
    student.hasSubscription,
    student.startSubscription,
    student.paidLessons,
    student.additional,
    JSON.stringify([]),
  ];

  try {
    await db.runAsync(query, value);
  } catch (e) {
    console.error("error inserting new student:", e);
  }
};
