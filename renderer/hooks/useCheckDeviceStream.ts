import { useState } from "react"

const useDeviceStreamCheck = () => {
  const [isMuted, setIsMuted] = useState<boolean | string>("undefined")
  const [isActive, setIsActive] = useState<boolean | string>("undefined")
  const [isDeviceChecked, setIsDeviceChecked] = useState(false)
  const [isQrayDeviceStreamOn, setIsQrayDeviceStreamOn] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | undefined>(undefined)

  const checkDeviceStream = (localStream: MediaStream | undefined, selectedDeviceLabel: string, platform: string) => {
    if (localStream != undefined) {
      const { active } = localStream
      const { muted } = localStream.getVideoTracks()[0]
      setIsMuted(typeof muted === "boolean" ? muted : "undefined")
      setIsActive(typeof active === "boolean" ? active : "undefined")

      console.log(localStream)
      console.log(localStream.getVideoTracks()[0])
      console.log(`os: ${platform}, muted: ${localStream.getVideoTracks()[0].muted}, active: ${localStream.active}`)

      switch (platform) {
        case "Windows":
          switch (selectedDeviceLabel) {
            case "QRAYPEN":
              if (!muted && active && !isQrayDeviceStreamOn) {
                console.log("스트림 최초 체크인 for windows")
                setIsDeviceChecked(true)
              } else if (!muted && active && isQrayDeviceStreamOn) {
                console.log("스트림 체크인 for windows")
              } else {
                console.log("스트림 체크아웃 for windows")
                setIsQrayDeviceStreamOn(false)
                setLocalStream(undefined)
              }
              break
            case "QRAYCAM":
              if (active && !isQrayDeviceStreamOn) {
                console.log("스트림 최초 체크인 for windows")
                setIsDeviceChecked(true)
              } else if (active && isQrayDeviceStreamOn) {
                console.log("스트림 체크인 for windows")
              } else {
                console.log("스트림 체크아웃 for windows")
                setIsQrayDeviceStreamOn(false)
                setLocalStream(undefined)
              }
          }
          break
        case "macOS":
          if (active && !isQrayDeviceStreamOn) {
            setIsQrayDeviceStreamOn(true)
            console.log("스트림 최초 체크인 for mac")
          } else if (active && isQrayDeviceStreamOn) {
            console.log("스트림 체크인 for mac")
          } else {
            console.log("스트림 체크아웃 for mac1")
            setIsQrayDeviceStreamOn(false)
            setLocalStream(undefined)
          }
          break
        default:
          console.log("Linux or unknown os")
      }
    }
  }

  return {
    isMuted,
    isActive,
    isDeviceChecked,
    isQrayDeviceStreamOn,
    localStream,
    checkDeviceStream
  }
}

export default useDeviceStreamCheck
