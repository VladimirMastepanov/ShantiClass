import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { useDateContext } from "./dateContext";
import { StudentsMarksType, VisitDescription } from "../types/dbTypes";
import { getStudentVisitsForDate } from "../database/api/getStudentVisitsForDate";
import { getVisitStatisticsForDate } from "../database/api/getVisitStatisticsForDate";

interface VisitContextType {
  counter: VisitDescription | null;
  setCounter: (counter: VisitDescription) => void;
  shouldRefreshCounter: boolean;
  setShouldRefreshCounter: (arg: boolean) => void;
  studentsCurrentDayMarks: StudentsMarksType;
  setStudentsCurrentDayMarks: (
    studentsCurrentDayMarks: StudentsMarksType
  ) => void;
}

const VisitContext = createContext<VisitContextType | undefined>(undefined);

export const VisitProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [counter, setCounter] = useState<VisitDescription | null>(null);
  const [shouldRefreshCounter, setShouldRefreshCounter] =
    useState<boolean>(false);
  const [studentsCurrentDayMarks, setStudentsCurrentDayMarks] =
    useState<StudentsMarksType>({});
  const db = useSQLiteContext();
  const { currentDate } = useDateContext();

  useEffect(() => {
    const loadData = async (db: SQLiteDatabase) => {
      try {
        const statistic = await getVisitStatisticsForDate(currentDate, db);
        console.error("VisitProvider statistic:", statistic);
        const studentVisits = await getStudentVisitsForDate(currentDate, db);
        console.error("VisitProvider studentVisits:", studentVisits);

        setCounter(statistic);
        setStudentsCurrentDayMarks(studentVisits);
      } catch (e) {
        console.error(
          "fetching counterData from Db for CounterProvider error:",
          e
        );
      }
    };
    loadData(db);

    if (shouldRefreshCounter) {
      loadData(db);
      setShouldRefreshCounter(false);
    }
  }, [db, shouldRefreshCounter, currentDate]);

  return (
    <VisitContext.Provider
      value={{
        counter,
        setCounter,
        shouldRefreshCounter,
        setShouldRefreshCounter,
        studentsCurrentDayMarks,
        setStudentsCurrentDayMarks,
      }}
    >
      {children}
    </VisitContext.Provider>
  );
};

export const useVisitContext = (): VisitContextType => {
  const context = useContext(VisitContext);
  if (!context) {
    throw new Error("useVisit must be used within a VisitProvider");
  }
  return context;
};
