import { BrowserWindow, app, dialog, ipcMain } from "electron"
import serve from "electron-serve"
import * as fs from "fs"
import * as os from "os"
import * as path from "path"
import { usb } from "usb"
import { createWindow } from "./helpers"

const isProd: boolean = process.env.NODE_ENV === "production"

let mainWindow: BrowserWindow | null = null
let patientListWindow: BrowserWindow | null = null
let selectedFolder: string | null = null
let qrayImagePath: string

if (os.platform() === "darwin") {
  // 맥일 경우 바탕화면 경로 설정
  const desktopPath = path.join(os.homedir(), "Desktop")
  qrayImagePath = path.join(desktopPath, "qrayimage")
} else if (os.platform() === "win32") {
  // 윈도우일 경우 C 드라이브 경로 설정
  const driveLetter = "C:"
  qrayImagePath = path.join(driveLetter, "qrayimage")
}

const handleUSBAttach = (device: any) => {
  console.log("USB Device Attached")
  console.log("oh! device", device)
}

const handleUSBDetach = (device: any) => {
  console.log("USB Device Detached")
  console.log(device)
}

const createPatientListWindow = async () => {
  patientListWindow = new BrowserWindow({
    width: 800,
    height: 300,
    parent: mainWindow, // 기존 창을 부모로 설정
    modal: true, // 모달 창으로 설정 (부모 창 위에만 표시)
    webPreferences: {
      nodeIntegration: true, // 추가
      contextIsolation: false,
    },
  });

  if (isProd) {
    await patientListWindow.loadURL("app://./patient.html");
  } else {
    const port = process.argv[2];
    await patientListWindow.loadURL(`http://localhost:${port}/patient`);
    patientListWindow.webContents.openDevTools({ mode: "detach" });
  }

  patientListWindow.on('closed', () => {
    patientListWindow = null;
  });
}

if (isProd) {
  serve({ directory: "app" })
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`)
}

;(async () => {
  await app.whenReady()
  

  mainWindow = createWindow("main", {
    width: 1728,
    height: 972,
    minWidth: 1270,
    minHeight: 720,
    webPreferences: {
      webSecurity: false
    }
  })

  if (isProd) {
    await mainWindow.loadURL("app://./home.html")
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools({ mode: "detach" })
  }
})()

ipcMain.on("open-directory-dialog", async event => {
  if (!fs.existsSync(qrayImagePath)) {
    try {
      fs.mkdirSync(qrayImagePath)
    } catch (error) {
      console.error("Error creating directory at", qrayImagePath, ":", error)
      return
    }
  }

  try {
    const result = await dialog.showOpenDialog(mainWindow!, {
      defaultPath: qrayImagePath,
      properties: ["openDirectory", "createDirectory", "openFile"]
    })

    if (!result.canceled && result.filePaths.length > 0) {
      selectedFolder = result.filePaths[0]

      const filesInSelectedFolder = fs.readdirSync(selectedFolder)
      const imageFilesInSelectedFolder = filesInSelectedFolder.filter(file => file.endsWith(".png"))
      const imageFilePathsInSelectedFolder = imageFilesInSelectedFolder.map(
        filename => "file://" + path.join(selectedFolder!, filename)
      )

      event.sender.send("selected-folder", selectedFolder)
      event.sender.send("selected-files", imageFilePathsInSelectedFolder)
    }
  } catch (error) {
    console.error(error)
  }
})

ipcMain.on("image-saved", async (event, newPhotoInfo) => {
  const { name, imgSrc } = newPhotoInfo

  if (selectedFolder) {
    const safeName = `${name.replace(/:/g, "-")}`
    const targetFolder = selectedFolder
    const imagePath = path.join(targetFolder, `${safeName}`)

    try {
      fs.writeFileSync(imagePath, imgSrc.replace(/^data:image\/png;base64,/, ""), "base64")
      console.log(`Image saved to ${imagePath}`)
    } catch (error) {
      console.error(error)
    }

    const filesInSelectedFolder = fs.readdirSync(selectedFolder)
    const imageFilesInSelectedFolder = filesInSelectedFolder.filter(file => file.endsWith(".png"))
    const imageFilePathsInSelectedFolder = imageFilesInSelectedFolder.map(
      filename => "file://" + path.join(selectedFolder!, filename)
    )

    event.sender.send("selected-files", imageFilePathsInSelectedFolder)
  }
})

ipcMain.on("delete-image", async (event, imgName) => {
  const imgNameWithoutFilePrefix = imgName.replace("file://", "")

  try {
    fs.unlinkSync(imgNameWithoutFilePrefix)
    console.log(`Image deleted at ${imgNameWithoutFilePrefix}`)
  } catch (error) {
    console.error(error)
  }

  const filesInSelectedFolder = fs.readdirSync(selectedFolder)
  const imageFilesInSelectedFolder = filesInSelectedFolder.filter(file => file.endsWith(".png"))
  const imageFilePathsInSelectedFolder = imageFilesInSelectedFolder.map(
    filename => "file://" + path.join(selectedFolder!, filename)
  )

  const result = imageFilePathsInSelectedFolder.map(e => {
    const parts = e.split("/")
    const fileName = parts[parts.length - 1]

    const arg = {
      name: fileName,
      imgSrc: e
    }
    return arg
  })

  event.reply("delete-image", result)
})

ipcMain.on('show-patient-list', () => {
  if (!patientListWindow) {
    createPatientListWindow();
  }

  ipcMain.on("close-patient-list", () => {
    if(patientListWindow) {
      patientListWindow.close()
      patientListWindow = null;
    }
  })
});

app.on("ready", () => {
  usb.on("attach", handleUSBAttach)
  usb.on("detach", handleUSBDetach)
})

app.on("window-all-closed", () => {
  app.quit()
})
