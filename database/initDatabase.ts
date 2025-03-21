import * as SQLite from "expo-sqlite";

export const initDatabase = async (
  db: SQLite.SQLiteDatabase,
): Promise<void> => {
  const initTables = async () => {
    const tables = [
      `CREATE TABLE IF NOT EXISTS Students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    instagram TEXT,
    hasSubscription BOOLEAN NOT NULL CHECK (hasSubscription IN (0, 1)),
    startSubscription TIMESTAMP,
    paidLessons INTEGER,
    additional TEXT
    );`,
      `CREATE TABLE IF NOT EXISTS VisitStatistic (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TIMESTAMP,
    singed INTEGER,
    unSinged INTEGER
    );`,
    ];

    for (const query of tables) {
      await db.execAsync(query);
    }
    console.log("initTables ok");
  };

  try {
    const tablesInitialized = await db.getFirstAsync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='Students';`,
    );

    if (!tablesInitialized) {
      console.log("!tablesInitialized");
      await initTables();
      console.log("await initTables()");
    }
  } catch (e) {
    console.error("Error init database:", e);
  }
};
