import { ipcRenderer } from "electron"
import { useEffect, useState } from "react"
import { CapturedImage } from "types"

function deleteImage(imgSrc: string) {
  ipcRenderer.send("delete-image", imgSrc)
}

function useImageDeletion(
  setStateFunc: React.Dispatch<React.SetStateAction<CapturedImage[]>>
) {
  console.log("실행중1")
  const [shouldListen, setShouldListen] = useState(false)

  useEffect(() => {
    if (!shouldListen) return

    const handleDelete = (_: any, updatedImageList: CapturedImage[]) => {
      setStateFunc(_prev => [...updatedImageList])
      setShouldListen(false)
    }

    ipcRenderer.on("delete-image", handleDelete)

    return () => {
      ipcRenderer.removeListener("delete-image", handleDelete)
    }
  }, [setStateFunc, shouldListen])

  return setShouldListen
}

export { deleteImage, useImageDeletion }
