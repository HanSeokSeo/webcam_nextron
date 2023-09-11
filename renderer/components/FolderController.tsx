import * as fs from "fs";
import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import path from "path";

interface CapturedPhotos {
  name: string;
  imgSrc: string;
}

function FolderController({ setCapturedPhotos }: { setCapturedPhotos: React.Dispatch<React.SetStateAction<CapturedPhotos[]>> }) {
  const [folderPath, setFolderPath] = useState<string | undefined>();

  const openDirectoryDialog = async () => {
    ipcRenderer.send("open-directory-dialog");
  };

  const getPngFilePaths = (folderPath: string | undefined) => {
    if (!folderPath) return;

    try {
      const files = fs.readdirSync(folderPath);
      const pngFiles = files.filter((file) => file.toLowerCase().endsWith(".png"));

      const fileList = pngFiles.map((e) => ({
        name: e,
        imgSrc: `${folderPath}/${e}`,
      }));

      console.log(fileList);

      setCapturedPhotos(fileList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    ipcRenderer.on("selected-folder", (event, folderPath) => {
      setFolderPath(folderPath);
      getPngFilePaths(folderPath);

      return () => {
        ipcRenderer.removeAllListeners("selected-folder");
      };
    });
  }, []);

  return (
    <div className="border-b-2 border-l-2 border-slate-500 h-1/5">
      <button
        className="w-1/3 px-4 py-2 m-2 bg-purple-500 rounded-md hover:bg-purple-600 active:bg-purple-700"
        onClick={openDirectoryDialog}
      >
        Open Folder
      </button>
      <div>{folderPath}</div>
    </div>
  );
}

export default FolderController;
