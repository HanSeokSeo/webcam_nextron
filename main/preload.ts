import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  openDirectoryDialog: () => ipcRenderer.invoke("open-directory-dialog"),
  readDirectory: (path: string) => ipcRenderer.invoke("read-directory", path),
});
