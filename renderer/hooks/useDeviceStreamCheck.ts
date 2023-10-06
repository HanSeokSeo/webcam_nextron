import { useState } from "react"

const useDeviceStreamCheck = () => {
  const [localStream, setLocalStream] = useState<MediaStream | undefined>(undefined)
  const [isQrayDeviceStreamOn, setIsQrayDeviceStreamOn] = useState(false)
  const [isMuted, setIsMuted] = useState<boolean | string>("undefined")
  const [isActive, setIsActive] = useState<boolean | string>("undefined")
  const [isDeviceChecked, setIsDeviceChecked] = useState(false)

  const getDeviceStream = async (checkedDeviceId: string | undefined, platform: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: checkedDeviceId } }
      })

      console.log(stream)

      if (stream) {
        if ((platform === "Windows" && !stream.getVideoTracks()[0].muted) || (platform === "macOS" && stream.active)) {
          startStream(videoRef, stream)
          setLocalStream(stream)
          setIsQrayDeviceStreamOn(true)
        } else {
          setIsQrayDeviceStreamOn(false)
        }
      }
    } catch (error) {
      console.error("Error in mediaStream", error)
      handleMediaStreamError(error, platform)
    }
  }

  const checkDeviceStream = () => {
    if (localStream !== undefined) {
      const { active } = localStream
      const { muted } = localStream.getVideoTracks()[0]

      setIsMuted(typeof muted === "boolean" ? muted : "undefined")
      setIsActive(typeof active === "boolean" ? active : "undefined")

      // Rest of your logic for checking the device stream

      // ...

      console.log(localStream)
      console.log(localStream.getVideoTracks()[0])
      console.log(`os: ${platform}, muted: ${localStream.getVideoTracks()[0].muted}, active: ${localStream.active}`)
    }
  }

  return {
    localStream,
    isQrayDeviceStreamOn,
    isMuted,
    isActive,
    isDeviceChecked,
    getDeviceStream,
    checkDeviceStream
  }
}

export default useDeviceStreamCheck
