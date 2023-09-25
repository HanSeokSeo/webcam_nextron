import React from "react"
import Image from "next/image"

interface ViewerProps {
  videoRef: React.RefObject<HTMLVideoElement>
  isQrayDeviceStreamOn: boolean
  isCaptureMode: boolean
  clickedImageSrc: string
}

function ViewerMain({ videoRef, isQrayDeviceStreamOn, isCaptureMode, clickedImageSrc }: ViewerProps) {
  return (
    <div className="flex flex-col w-full border-l-2 border-slate-500">
      <div className="h-[5%] ml-3 mt-3 ">QrayStream {isQrayDeviceStreamOn ? "ON" : "OFF"}</div>
      <div className={`h-[95%] w-full flex justify-center ${isCaptureMode ? "" : "hidden"}`}>
        <video
          width="1280"
          height="720"
          autoPlay
          ref={videoRef}
          muted
          className={`h-full ${isQrayDeviceStreamOn ? "" : "hidden"} `}
        />
        <div className={`flex flex-col items-center justify-center text-2xl  ${isQrayDeviceStreamOn ? "hidden" : ""}`}>
          <p>Qray device is not connected.</p>
          <p>After connecting the cables and turn on the power.</p>
          <div className="w-[250px] h-[150px] relative flex-col mt-6">
            <Image src="/images/qray_yellow.jpeg" alt="Qray normal connection" layout="fill" objectFit="cover" priority />
          </div>
        </div>
      </div>
      {clickedImageSrc ? (
        <div className={`h-[95%] w-full flex justify-center ${isCaptureMode ? "hidden" : ""}`}>
          <div className="h-[90%] w-full relative flex-col mt-6">
            <Image src={clickedImageSrc} alt="Qray normal connection" layout="fill" objectFit="cover" priority />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default ViewerMain
