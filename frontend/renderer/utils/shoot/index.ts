//@ts-check
import { ipcRenderer } from "electron"
import { CapturedImage } from "types"
import { getCurrentDateTime } from "utils/helpers"
import { Dispatch, SetStateAction, useCallback } from "react"

/**
 * 주어진 비디오 요소에서 이미지를 캡쳐하고 그 결과를 데이터 URL 형태로 반환합니다.
 *
 * @param {HTMLVideoElement} cam - 이미지를 캡쳐할 비디오 요소입니다.
 * @returns {string | null} 성공적으로 이미지가 캡쳐되면 데이터 URL을 반환하고, 그렇지 않으면 null을 반환합니다.
 */
function captureFromCamera(cam: HTMLVideoElement): string | null {
  const canvas = document.createElement("canvas")
  canvas.width = cam.videoWidth
  canvas.height = cam.videoHeight

  const ctx = canvas.getContext("2d")

  if (ctx) {
    console.log(`width:${cam.videoWidth}, height:${cam.videoHeight}`)
    ctx.drawImage(cam, 0, 0, cam.videoWidth, cam.videoHeight)

    return canvas.toDataURL()
  }

  return null
}

/**
 * 비디오 소스에서 이미지를 캡쳐하고 캡쳐된 이미지 목록을 업데이트합니다.
 *
 * @param {React.RefObject<HTMLVideoElement>} videoRef - 이미지 소스로 사용되는 비디오 요소를 가리키는 ref 객체입니다.
 * @param { Dispatch<SetStateAction<CapturedImage[]>>} setStateFunc - 캡쳐된 이미지 목록을 업데이트하는 React setState 함수입니다.
 */
function captureImage(
  videoRef: React.RefObject<HTMLVideoElement>,
  setStateFunc: Dispatch<SetStateAction<CapturedImage[]>>
) {
  const cam = videoRef.current

  if (cam && cam.srcObject) {
    const imageSrc = captureFromCamera(cam)

    if (imageSrc) {
      const currentTime: string = getCurrentDateTime()
      const newPhotoInfo = {
        name: currentTime + ".png",
        imgSrc: imageSrc
      }

      setStateFunc(prev => [...prev, newPhotoInfo])
      ipcRenderer.send("image-saved", newPhotoInfo)
    }
  }
}

/**
 * 이미지를 삭제하고 삭제 후의 이미지 목록을 업데이트합니다.

 * @param {string} imgSrc - 삭제할 이미지의 경로 또는 URL.
 * @param { Dispatch<SetStateAction<CapturedImage[]>>} setStateFunc - 이미지 목록 상태를 업데이트하는 React setState 함수.
 */
function deleteImage(imgSrc: string, setStateFunc: Dispatch<SetStateAction<CapturedImage[]>>) {
  ipcRenderer.send("delete-image", imgSrc)
  ipcRenderer.on("delete-image", (_, updatedImageList) => {
    setStateFunc(_prev => [...updatedImageList])
  })
}

export { captureImage, deleteImage }
