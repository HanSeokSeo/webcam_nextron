// main/background.ts

import { app, ipcMain, dialog, BrowserWindow } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import fs from "fs";
import path from "path";

const isProd: boolean = process.env.NODE_ENV === "production";

let mainWindow: BrowserWindow | null = null;

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 1650,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "../dist/preload.js"),
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

ipcMain.handle("open-directory-dialog", async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ["openDirectory"],
  });

  if (!result.canceled) return result.filePaths[0];
});

ipcMain.handle("read-directory", async (_, path) => fs.readdirSync(path));

app.on("window-all-closed", () => {
  app.quit();
});
