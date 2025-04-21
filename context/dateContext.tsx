import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import { normolizeDate } from "../utilities/dateToYYMMDD";

interface DateContextType {
  currentDate: string;
  setCurrentDate: (currentDate: string) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentDate, setCurrentDate] = useState<string>(
    normolizeDate(new Date())
  );

  return (
    <DateContext.Provider value={{ currentDate, setCurrentDate }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDateContext = (): DateContextType => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};
