import { useCallback, useEffect, useRef, useState } from "react"
import { useInterval } from "usehooks-ts"
import { getAgentSystem, getCurrentDateTime, startStream, stopStream, trimTextToLength } from "utils"

import ImageList from "@/components/ImageList"
import ViewerMain from "@/components/ViewerMain"
import ViewerController from "@/components/ViewerController"
import ViewerStatus from "@/components/ViewerStatus"
import FolderController from "@/components/FolderController"

import { ipcRenderer } from "electron"
import useConnectedDevices from "hooks/useConnectedDevices"

interface CapturedImages {
  name: string
  imgSrc: string
}

interface ConnectedDeviceInfo {
  deviceInfo: MediaDeviceInfo
  checked: boolean
}

function Cams() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [capturedImages, setCapturedImages] = useState<CapturedImages[]>([])

  const [selectedDeviceId, setSeletedDeviceId] = useState<string | undefined>(undefined) // 현재 체크된 기기 아이디
  const [selectedDeviceLabel, setSeletedDeviceLabel] = useState<string | undefined>(undefined) // 현재 체크된 기기 라벨
  const [previousDeviceId, setPreviousDeviceId] = useState<string | undefined>(undefined) // 바로 직전에 체크되었던 기기 아이디

  const [isDeviceChecked, setIsDeviceChecked] = useState<boolean>(false)

  const [platform, setPlatform] = useState<string>("unknown")

  const [isNeededCheckingStream, setIsNeededCheckingStream] = useState<boolean>(false)

  const [localStream, setLocalStream] = useState<MediaStream | undefined>(undefined)

  const [isQrayDeviceStreamOn, setIsQrayDeviceStreamOn] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [checkCase, setCheckCase] = useState<string | undefined>(undefined)

  const [isMuted, setIsMuted] = useState<boolean | string>("undefined")
  const [isActive, setIsActive] = useState<boolean | string>("undefined")

  const [isCaptureMode, setIsCaptureMode] = useState<boolean>(true)
  const [clickedImageSrc, setClickedImageSrc] = useState<string>("")

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const { deviceList, setDeviceList, getConnectedDevices } = useConnectedDevices(selectedDeviceId)

  // 연결된 기기를 통해 들어오는 stream 가져오기
  const getDeviceStream = async (checkedDeviceId: string | undefined, platform: string) => {
    try {
      await navigator.mediaDevices
        .getUserMedia({
          video: { deviceId: { exact: checkedDeviceId } }
        })
        .then(stream => {
          console.log(stream)
          if (stream !== undefined) {
            if (platform === "Windows") {
              const { muted } = stream.getVideoTracks()[0]

              if (!muted) {
                startStream(videoRef, stream)
                setLocalStream(stream)
                setIsQrayDeviceStreamOn(true)
              } else {
                setIsQrayDeviceStreamOn(false)
              }
            } else if (platform === "macOS") {
              const { active } = stream

              if (active) {
                startStream(videoRef, stream)
                setLocalStream(stream)
                setIsQrayDeviceStreamOn(true)
              } else {
                setIsQrayDeviceStreamOn(false)
              }
            }
          }
        })
    } catch (error) {
      console.log("error in mediaStream", error)

      if (selectedDeviceLabel === "QRAYCAM") {
        if (platform === "macOS") {
          console.log("10")
          setLocalStream(undefined)
          setSeletedDeviceId(undefined)
          setIsDeviceChecked(false)
          setIsNeededCheckingStream(false)
        }

        if (platform === "Windows" && String(error).includes("Requested device not found")) {
          setLocalStream(undefined)
          setSeletedDeviceId(undefined)
          setSeletedDeviceLabel(undefined)
          setIsDeviceChecked(false)
          setIsNeededCheckingStream(false)
        }
      }

      if (selectedDeviceLabel === "QRAYPEN") {
        console.log("20")
        setLocalStream(undefined)
        setSeletedDeviceId(undefined)
        setIsDeviceChecked(false)
        setIsNeededCheckingStream(false)

        if (platform === "Windows" && String(error).includes("Requested device not found")) {
          // setIsNeededCheckingStream(false)
        }
      }
    }
  }

  // 기기의 체크 상태에 따른 각종 상태값 변경
  const handleCheckboxChange = (changedDeviceId: string, changedDeviceLabel: string) => {
    const upDatedDeviceList: ConnectedDeviceInfo[] = []

    // Device Label 생성
    const makeLabel = (targetLabel: string) => {
      const arg = targetLabel.toUpperCase()

      if (arg.includes("QRAYCAM")) return "QRAYCAM"
      if (arg.includes("QRAYPEN")) return "QRAYPEN"
    }

    let deviceLabel

    if (changedDeviceLabel) {
      deviceLabel = makeLabel(changedDeviceLabel)
    }

    // case: initial, 최초로 체크 버튼을 눌렀을 경우
    if (selectedDeviceId === undefined) {
      deviceList.forEach(device => {
        const checkedValue = device.deviceInfo.deviceId === changedDeviceId ? true : false
        const newElement = {
          deviceInfo: device.deviceInfo,
          checked: checkedValue
        }
        upDatedDeviceList.push(newElement)
      })

      setCheckCase("initial")
      setSeletedDeviceId(changedDeviceId)
      setSeletedDeviceLabel(deviceLabel)
      setIsDeviceChecked(true)
      console.log("Initial Check")
    } else if (changedDeviceId !== selectedDeviceId) {
      // 체크가 되어 있는 상태에서 다른 기기를 체크한 경우
      deviceList.forEach(device => {
        const checkedValue = device.deviceInfo.deviceId === changedDeviceId ? true : false
        const newElement = {
          deviceInfo: device.deviceInfo,
          checked: checkedValue
        }
        upDatedDeviceList.push(newElement)
      })
      setCheckCase("single")
      setSeletedDeviceId(changedDeviceId)
      setSeletedDeviceLabel(deviceLabel)
      setIsDeviceChecked(true)
      console.log("Sigle Check")
    } else {
      // 중복으로 체크 버튼 누른 경우 체크 해제
      deviceList.forEach(device => {
        const newElement = { deviceInfo: device.deviceInfo, checked: false }
        upDatedDeviceList.push(newElement)
      })
      setCheckCase("double")
      setSeletedDeviceId(undefined)
      setSeletedDeviceLabel(undefined)
      setIsDeviceChecked(false)
      setIsMuted("undefined")
      setIsActive("undefined")
      console.log("Double Check")
    }
    setPreviousDeviceId(selectedDeviceId === undefined ? undefined : selectedDeviceId)
    setDeviceList(upDatedDeviceList)
    setLocalStream(undefined)
    setIsNeededCheckingStream(!isNeededCheckingStream)
  }

  // useInterval 중 기기의 스트림 체크하기
  const checkDeviceStream = (localStream: MediaStream | undefined) => {
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

  // 사진 촬영
  const captureImage = useCallback(() => {
    const cam = videoRef.current

    if (cam && cam.srcObject) {
      const canvas = document.createElement("canvas")
      canvas.width = cam.videoWidth
      canvas.height = cam.videoHeight

      const ctx = canvas.getContext("2d")

      if (ctx) {
        console.log(`width:${cam.videoWidth}, height:${cam.videoHeight}`)
        ctx.drawImage(cam, 0, 0, cam.videoWidth, cam.videoHeight)

        const imageSrc = canvas.toDataURL()
        const currentTime: string = getCurrentDateTime()
        const newPhotoInfo = {
          name: currentTime + ".png",
          imgSrc: imageSrc
        }

        setCapturedImages(prev => [...prev, newPhotoInfo])
        ipcRenderer.send("image-saved", newPhotoInfo)
      }
    }
  }, [])

  // 이미지 리스트에서 사진을 클릭한 경우
  const showClickedImage = useCallback((src: string) => {
    if (isCaptureMode) {
      setIsCaptureMode(false)
      setClickedImageSrc(src)
    } else {
      setClickedImageSrc(src)
    }
  }, [])

  // 이미지 리스트에서 사진 삭제 버튼을 클릭한 경우
  const deleteImage = useCallback((imgSrc: string) => {
    ipcRenderer.send("delete-image", imgSrc)
    ipcRenderer.on("delete-image", (_, updatedImageList) => {
      setCapturedImages(prev => [...updatedImageList])
    })
  }, [])

  useInterval(() => {
    setCount(count => count + 1)
    console.log(count)
    console.log(deviceList)
    console.log("localStream:", localStream)
    console.log(`isNeededCheckingStream: ${isNeededCheckingStream}`)
    console.log(`isDeviceChecked: ${isDeviceChecked}, checkCase: ${checkCase}`)
    console.log(`selectedDeviceId: ${trimTextToLength(selectedDeviceId, 30)}`)
    console.log(`selectedDeviceLabel: ${selectedDeviceLabel}`)
    console.log(`previouseDeviceId: ${trimTextToLength(previousDeviceId, 30)}`)
    getConnectedDevices()

    if (isNeededCheckingStream) {
      console.log("selectedDeviceId", selectedDeviceId)
      if (selectedDeviceId) {
        localStream === undefined ? getDeviceStream(selectedDeviceId, platform) : checkDeviceStream(localStream)
      }
    } else {
      if (isDeviceChecked) {
        switch (checkCase) {
          case "initial":
            console.log("1")
            getDeviceStream(selectedDeviceId, platform)
            setIsNeededCheckingStream(true)
            break
          case "single":
            console.log("2")
            stopStream(videoRef, previousDeviceId)
            getDeviceStream(selectedDeviceId, platform)
            setIsNeededCheckingStream(true)
        }
      } else {
        setIsQrayDeviceStreamOn(false)
      }
    }
  }, 2000)

  // 최초 실행시 카메라 허용과 OS 탐지
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })

    const detectedPlatform = getAgentSystem()
    if (detectedPlatform) {
      setPlatform(detectedPlatform)
      getConnectedDevices()
    }

    window.addEventListener("keydown", captureImage, true)
  }, [])

  return (
    <>
      <div className="flex justify-center w-screen h-screen">
        <div className="w-[25%] flex flex-col h-screen">
          <ImageList capturedImages={capturedImages} showClickedImage={showClickedImage} deleteImage={deleteImage} />
          <FolderController setCapturedImages={setCapturedImages} platform={platform} />
        </div>

        <div className="w-[75%]">
          <div className="flex h-4/5 border-slate-500 border-2">
            <ViewerStatus
              count={count}
              platform={platform}
              isDeviceChecked={isDeviceChecked}
              isQrayDeviceStreamOn={isQrayDeviceStreamOn}
              isMuted={isMuted}
              isActive={isActive}
              isCaptureMode={isCaptureMode}
              setIsCaptureMode={setIsCaptureMode}
              setIsNeededCheckingStream={setIsNeededCheckingStream}
            />
            <ViewerMain
              videoRef={videoRef}
              isQrayDeviceStreamOn={isQrayDeviceStreamOn}
              isCaptureMode={isCaptureMode}
              clickedImageSrc={clickedImageSrc}
            />
          </div>
          <ViewerController
            isPlaying={isPlaying}
            deviceList={deviceList}
            handleCheckboxChange={handleCheckboxChange}
            captureImage={captureImage}
          />
        </div>
      </div>
    </>
  )
}

export default Cams
