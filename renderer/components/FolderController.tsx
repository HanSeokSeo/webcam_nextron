import * as fs from "fs";
import { useState } from "react";
import { ipcRenderer } from "electron";

function FolderController() {
  const [folderPath, setFolderPath] = useState<string | undefined>();

  const openDirectoryDialog = async () => {
    // Open the directory selection dialog and get the selected path.
    ipcRenderer.send("open-directory-dialog");
  };

  return (
    <div className="border-b-2 border-l-2 border-slate-500 h-1/5">
      <button
        className="w-1/3 px-4 py-2 m-2 bg-purple-500 rounded-md hover:bg-purple-600 active:bg-purple-700"
        onClick={openDirectoryDialog}
      >
        Open Folder
      </button>

      {/* {folderPath && <FolderViewer folderPath={folderPath} />} */}
    </div>
  );
}

export default FolderController;
