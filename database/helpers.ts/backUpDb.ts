import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

export const DATABASE_NAME = "app.db";
const dbDir = `${FileSystem.documentDirectory}/SQLite`;
export const dbPath = `${dbDir}/${DATABASE_NAME}`;

export const exportDb = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(dbPath);

    if (fileInfo.exists) {
      await Sharing.shareAsync(dbPath);
    }
  } catch (e) {
    console.warn("База данных не найдена:", e);
  }
};

export const importDb = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.warn("Импорт отменён или файл не выбран");
      return;
    }

    const selectedFile = result.assets[0];
    const selectedFileUri = selectedFile.uri;
    const dirInfo = await FileSystem.getInfoAsync(dbDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
    }

    await FileSystem.copyAsync({
      from: selectedFileUri,
      to: dbPath,
    });
  } catch (err) {
    console.warn("Импорт отменет или файл не выбран:", err);
  }
};
