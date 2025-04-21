import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSQLiteContext } from "expo-sqlite";
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
    const loadInitialData = async () => {
      try {
        const statistic = await getVisitStatisticsForDate(currentDate, db);
        const studentVisits = await getStudentVisitsForDate(currentDate, db);
        setCounter(statistic);
        setStudentsCurrentDayMarks(studentVisits);
      } catch (e) {
        console.error("Ошибка при загрузке данных в VisitProvider:", e);
      }
    };
  
    loadInitialData();
  }, [currentDate, db]);
  
  useEffect(() => {
    const refreshData = async () => {
      if (shouldRefreshCounter) {
        try {
          const statistic = await getVisitStatisticsForDate(currentDate, db);
          const studentVisits = await getStudentVisitsForDate(currentDate, db);
          setCounter(statistic);
          setStudentsCurrentDayMarks(studentVisits);
        } catch (e) {
          console.error("Ошибка при обновлении данных в VisitProvider:", e);
        } finally {
          setShouldRefreshCounter(false);
        }
      }
    };
  
    refreshData();
  }, [shouldRefreshCounter, currentDate, db]);

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
