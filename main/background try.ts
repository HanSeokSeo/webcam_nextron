/**
 * ! 로컬 PC에 연결된 기기의 신호 감지를 위한 코드(작동안함)
 */
import { app, ipcMain, dialog, BrowserWindow } from "electron"
import serve from "electron-serve"
import { createWindow } from "./helpers"
import * as path from "path"
import * as fs from "fs"
import { usb, findByIds } from "usb"

const isProd: boolean = process.env.NODE_ENV === "production"

let mainWindow: BrowserWindow | null = null
let selectedFolder: string | null = null

const handleUSBAttach = (device: any) => {
  console.log("USB Device Attached")
  console.log("oh! device", device)
  try {
    device.open()
    const idVendor = 60186
    const idProduct = 20785
    const info = device.deviceDescriptor

    if (info.idVendor === idVendor && info.idProduct === idProduct) {
      let deviceINTF

      try {
        const specificDevice = findByIds(idVendor, idProduct)
        deviceINTF = specificDevice.interfaces[0]

        if (deviceINTF.isKernelDriverActive()) deviceINTF.detachKernelDriver()
        deviceINTF.claim()
        console.log("Claimed successfully.")
        console.log(device)
      } catch (error) {
        console.error("Error claiming the device:", error)
      }

      let ePs = deviceINTF.endpoints
      let epIN

      ePs.forEach((ep, index) => {
        if (ep.direction == "in") {
          // IN endpoint 찾기
          epIN = ep
        }
      })
      console.log("Endponint", epIN)

      if (epIN) {
        // 이벤트 리스너는 한 번만 등록하도록 수정
        epIN.removeAllListeners("data")
        epIN.on("data", data => {
          console.log("Button event received:", data)
        })

        setInterval(() => {
          // Polling 구현
          console.log("작동해라!!")
        }, 2000)
      } else {
        console.log("Error Occured")
      }
    }
  } catch (error) {
    console.error("Failed to open device:", error)
  }
}

const handleUSBDetach = (device: any) => {
  console.log("USB Device Detached")
  console.log(device)
}

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
      console.error("Error creating directory at", qrayImagePath, ":", error)
      return
    }
  }

  try {
    const result = await dialog.showOpenDialog(mainWindow!, {
      defaultPath: qrayImagePath,
      properties: ["openDirectory", "createDirectory", "openFile"],
    })

    if (!result.canceled && result.filePaths.length > 0) {
      selectedFolder = result.filePaths[0]

      const filesInSelectedFolder = fs.readdirSync(selectedFolder)
      const imageFilesInSelectedFolder = filesInSelectedFolder.filter(file => file.endsWith(".png"))
      const imageFilePathsInSelectedFolder = imageFilesInSelectedFolder.map(
        filename => "file://" + path.join(selectedFolder!, filename),
      )

      event.sender.send("selected-folder", selectedFolder)
      event.sender.send("selected-files", imageFilePathsInSelectedFolder)
    }
  } catch (error) {
    console.error(error)
  }
})

ipcMain.on("image-saved", async (_, newPhotoInfo) => {
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
  }
})

app.on("ready", () => {
  usb.on("attach", handleUSBAttach)
  usb.on("detach", handleUSBDetach)
})

app.on("window-all-closed", () => {
  app.quit()
})
