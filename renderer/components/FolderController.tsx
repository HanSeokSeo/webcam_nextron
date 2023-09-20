import * as fs from "fs"
import { useEffect, useState } from "react"
import { ipcRenderer } from "electron"
import path from "path"
import { AiFillFolderAdd, AiFillFolderOpen } from "react-icons/ai"
import { BiExit } from "react-icons/bi"

interface CapturedPhotos {
  name: string
  imgSrc: string
}

function FolderController({
  setCapturedPhotos,
  platform,
}: {
  setCapturedPhotos: React.Dispatch<React.SetStateAction<CapturedPhotos[]>>
  platform: string
}) {
  const [folderPath, setFolderPath] = useState<string>("")
  const [selectedPatient, setSelectedPatient] = useState<string>("")

  const openDirectoryDialog = async () => {
    ipcRenderer.send("open-directory-dialog")
  }

  useEffect(() => {
    ipcRenderer.on("selected-folder", (_, folderPath) => {
      const separator = platform === "macOS" ? "/" : String.raw`\\`
      const parts = folderPath.split(separator)
      const result = parts.slice(1, 5).join(separator)
      const patient = parts.pop()

      setFolderPath(result)
      setSelectedPatient(patient)
    })

    ipcRenderer.on("selected-files", (_, filePaths) => {
      const fileList = filePaths.map((filePath: string) => ({
        name: path.basename(filePath),
        imgSrc: filePath,
      }))

      setCapturedPhotos(fileList)

      return () => {
        ipcRenderer.removeAllListeners("selected-files")
      }
    })
  }, [platform])

  return (
    <div className="border-b-2 border-l-2 border-slate-500 h-1/5 p-2">
      <div className="h-[10%] flex justify-end">
        <AiFillFolderAdd
          title="Create Patient"
          size="24"
          className="hover:bg-gray-600 active:bg-gray-400 mr-2"
          onClick={openDirectoryDialog}
        />
        <AiFillFolderOpen
          title="Open Directory"
          size="24"
          className="hover:bg-gray-600 active:bg-gray-400 mr-2"
          onClick={openDirectoryDialog}
        />
        <BiExit
          title="Exit Application"
          size="24"
          className="hover:bg-gray-600 active:bg-gray-400"
          onClick={() => ipcRenderer.send("quit-app")}
        />
      </div>
      <div className="h-[40%]">
        <div className="h-1/2">Selected Folder : </div>
        <div className="pl-4 h-1/2">{folderPath}</div>
      </div>
      <div className="h-[40%] mt-2">
        <div className="h-1/3">Selected Patient : </div>
        <div className="h-2/3 text-2xl font-bold flex justify-center items-center">{selectedPatient}</div>
      </div>
    </div>
  )
}

export default FolderController
