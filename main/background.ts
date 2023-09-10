import { app, ipcMain, dialog, BrowserWindow } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import fs from "fs";

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
    // webPreferences: {
    //   nodeIntegration: true,
    //   contextIsolation: false,
    // },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
})();

ipcMain.on("open-directory-dialog", async (event) => {
  const result = await dialog
    .showOpenDialog(mainWindow!, {
      properties: ["openDirectory"],
    })
    .then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
      }
    });
});

ipcMain.handle("read-directory", async (_, path) => fs.readdirSync(path));

app.on("window-all-closed", () => {
  app.quit();
});
