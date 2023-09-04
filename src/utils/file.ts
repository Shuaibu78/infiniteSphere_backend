import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { FOLDER_PATHS, TypeOfFilePath } from ".";

export function saveFileToFolder(
  fileBuffer: Buffer,
  fileType: string,
  keyOfSaveFolderPath: TypeOfFilePath,
): Promise<string> {
  const saveFolderPath = FOLDER_PATHS[keyOfSaveFolderPath];

  if (!fs.existsSync(saveFolderPath)) {
    fs.mkdirSync(saveFolderPath, { recursive: true });
  }

  const fileExtension = fileType.split("/")[1];

  const fileId = `${uuidv4()}.${fileExtension}`;

  const filePath = path.join(saveFolderPath, fileId);

  return new Promise<string>((resolve, reject) => {
    fs.writeFile(filePath, fileBuffer, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(fileId);
      }
    });
  });
}
