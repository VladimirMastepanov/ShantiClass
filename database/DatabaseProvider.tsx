import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import { initDatabase } from "./initDatabase";

//start
import * as FileSystem from "expo-file-system";
import { AppState, AppStateStatus } from "react-native";
//end

const DATABASE_NAME = "app.db";

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  return (
    <SQLiteProvider databaseName={DATABASE_NAME}>
      <DatabaseInitializer onInitialized={() => setIsInitialized(true)} />

      {/* start */}
      {/* <DatabaseResetter /> */}
      {/* end */}

      {isInitialized ? children : null}
    </SQLiteProvider>
  );
};

interface DatabaseInitializerProps {
  onInitialized: () => void;
}

const DatabaseInitializer: React.FC<DatabaseInitializerProps> = ({
  onInitialized,
}) => {
  const db = useSQLiteContext();
  const initialized = useRef(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        if (db && !initialized.current) {
          await initDatabase(db);
          initialized.current = true;
          onInitialized();
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    if (db) {
      initializeDatabase();
    }
  }, [db, onInitialized]);

  return null;
};

//start
const DatabaseResetter: React.FC = () => {
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const resetDatabase = async () => {
      try {
        const dbDir = `${FileSystem.documentDirectory}/SQLite`;
        const dbPath = `${dbDir}/${DATABASE_NAME}`;

        const { exists } = await FileSystem.getInfoAsync(dbPath);
        if (exists) {
          // try {
          //   await AsyncStorage.setItem("isLoggedIn", "false");
          // } catch (e) {
          //   console.log("storage not clean");
          // }
          await FileSystem.deleteAsync(dbPath);
          console.log("Database file deleted successfully");
        }
      } catch (error) {
        console.error("Error resetting database:", error);
      }
    };
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current === "active" &&
        (nextAppState === "background" || nextAppState === "inactive")
      ) {
        resetDatabase();
      }
      appState.current = nextAppState;
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []);
  return null;
};
//end
