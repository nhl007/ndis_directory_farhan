"use server";
import fs from "fs";
import path from "path";
import { cwd } from "process";
// import { cwd } from "process";

export async function saveBase64Image(
  base64String: string,
  filePath: string,
  fileName: string
) {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");

  const directoryPath = path.join(cwd(), "public", filePath);

  // console.log(directoryPath, fileName);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  fs.writeFileSync(directoryPath + "/" + fileName, imageBuffer, "binary");
  return `/${filePath}/` + fileName;
}

const deleteImage = async (Path: string) => {
  const filePath = path.join(cwd(), "public", Path);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File does not exist");

      return;
    } else {
      // File exists, so delete it
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        } else {
          console.log("File deleted successfully");
        }
      });
    }
  });
};
