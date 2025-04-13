import { SQLiteDatabase } from "expo-sqlite";
import { StudentsDescription, StudentsFromDbDescription } from "../../types/dbTypes";
import { prepareStudents } from "../helpers.ts/prepareHistory";


export const getAllStudents = async (
  db: SQLiteDatabase,
): Promise<StudentsDescription[]> => {
  try {
    const query = "SELECT * FROM Students ORDER BY hasSubscription DESC, name COLLATE NOCASE;";
    const res = await db.getAllAsync<StudentsFromDbDescription>(query);
    if (!res || res.length === 0) {
      console.log("Students Data - []");
      return [];
    }
    return prepareStudents(res);
  } catch (error) {
    console.error("Error fetching students data:", error);
    return [];
  }
};
