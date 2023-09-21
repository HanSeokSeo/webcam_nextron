import { app, ipcMain, dialog, BrowserWindow } from "electron"
import serve from "electron-serve"
import { createWindow } from "./helpers"
import * as path from "path"
import * as fs from "fs"
import { usb, findByIds } from "usb"

const isProd: boolean = process.env.NODE_ENV === "production"

let mainWindow: BrowserWindow | null = null

let selectedFolder = null

if (isProd) {
  serve({ directory: "app" })
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`)
}

;(async () => {
  await app.whenReady()

  mainWindow = createWindow("main", {
    width: 1650,
    height: 800,
    webPreferences: {
      webSecurity: false,
    },
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
  const desktopPath = path.join(require("os").homedir(), "Desktop")
  const qrayImagePath = path.join(desktopPath, "qrayimage")

  if (!fs.existsSync(qrayImagePath)) {
    try {
      fs.mkdirSync(qrayImagePath)
    } catch (error) {
      console.error(console.error(`Error creating directory at ${qrayImagePath}:`, error), error)
      return
    }
  }

  await dialog
    .showOpenDialog(mainWindow!, {
      defaultPath: qrayImagePath,
      properties: ["openDirectory", "createDirectory", "openFile"],
    })
    .then(result => {
      if (!result.canceled && result.filePaths.length > 0) {
        selectedFolder = result.filePaths[0]

        const filesInSelectedFolder = fs.readdirSync(selectedFolder)
        const imageFilesInSelectedFolder = filesInSelectedFolder.filter(file => file.endsWith(".png"))
        const imageFilePathsInSelectedFolder = imageFilesInSelectedFolder.map(
          filename => "file://" + path.join(selectedFolder, filename),
        )

        event.sender.send("selected-folder", selectedFolder)
        event.sender.send("selected-files", imageFilePathsInSelectedFolder)
      }
    })
    .catch(error => {
      console.error(error)
    })
})

ipcMain.on("image-saved", async (_, newPhotoInfo) => {
  const { name, imgSrc } = newPhotoInfo

  if (selectedFolder) {
    const safeName = `${name.replace(/:/g, "-")}.png`
    const targetFolder = selectedFolder
    const imagePath = path.join(targetFolder, `${safeName}.png`)

    try {
      fs.writeFileSync(imagePath, imgSrc.replace(/^data:image\/png;base64,/, ""), "base64")
      console.log(`Image saved to ${imagePath}`)
    } catch (error) {
      console.error(error)
    }
  }
})

ipcMain.on("quit-app", () => {
  app.quit()
})

app.on("ready", () => {
  usb.on("attach", async function (device) {
    console.log("USB Device Attached")

    try {
      console.log(device)
      device.open()
    } catch (error) {
      console.error(`Failed to open device: ${error}`)
      return
    }

    const idVendor = 1204
    const idProduct = 18466
    const info = device.deviceDescriptor

    if (info.idVendor === idVendor && info.idProduct === idProduct) {
      let deviceINTF

      try {
        const device = findByIds(idVendor, idProduct)
        deviceINTF = device.interfaces[0]

        if (deviceINTF.isKernelDriverActive()) deviceINTF.detachKernelDriver()
        deviceINTF.claim().then(console.log("클레임 성공"))
      } catch (error) {}
    }
  })

  usb.on("detach", async function (device) {
    console.log("USB Device Detached")
    console.log(device)
    device.close()
  })
})

app.on("window-all-closed", () => {
  app.quit()
})
