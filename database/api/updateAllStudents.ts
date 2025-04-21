import { SQLiteDatabase } from "expo-sqlite";

export const updateAllStudents = async (db: SQLiteDatabase) => {
  const query = `
    UPDATE Students
    SET hasSubscription = CASE 
      WHEN paidLessons > 0 AND startSubscription >= DATE('now', '-2 months') 
      THEN 1 
      ELSE 0 
    END;`;
  try {
    await db.runAsync(query);
  } catch (error) {
    console.error("Error updating subscription information:", error);
  }
};
