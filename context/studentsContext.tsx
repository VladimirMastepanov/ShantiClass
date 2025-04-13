import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { StudentsDescription } from "../types/dbTypes";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { getAllStudents } from "../database/api/getAllStudents";
import { updateAllStudents } from "../database/api/updateAllStudents";

interface StudentsContextType {
  students: StudentsDescription[] | null;
  setStudents: (students: StudentsDescription[]) => void;
  shouldRefresh: boolean;
  setShouldRefresh: (arg: boolean) => void
}

const StudentsContext = createContext<StudentsContextType | undefined>(
  undefined
);

export const StudentsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [students, setStudents] = useState<StudentsDescription[] | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  const db = useSQLiteContext();

  useEffect(() => {
    const loadData = async (db: SQLiteDatabase) => {
      try {
        await updateAllStudents(db);
        const studentsfromDb = await getAllStudents(db);
        setStudents(studentsfromDb)
      } catch (e) {
        console.error(
          "fetching studentsData fromDb for StudentsProvider error:",
          e,
        );
      }
    }
    loadData(db);

    if(shouldRefresh) {
      loadData(db);
      setShouldRefresh(false);
    }
  }, [db, shouldRefresh]);

  return (
    <StudentsContext.Provider value={{ students, setStudents, shouldRefresh, setShouldRefresh }}>
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = (): StudentsContextType => {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error("useStudents must be used within a StudentsProvider");
  }
  return context;
};
