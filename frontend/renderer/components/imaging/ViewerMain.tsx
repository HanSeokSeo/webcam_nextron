import React from "react"
import Image from "next/image"

/**
 * ViewerMain 컴포넌트의 프로퍼티를 정의하는 인터페이스
 * @interface ViewerProps
 * @property {React.RefObject<HTMLVideoElement>} videoRef - 비디오 요소에 대한 Ref 객체
 * @property {boolean} isQrayDeviceStreamOn - Qray 디바이스 스트림 상태 여부
 * @property {boolean} isCaptureMode - 캡처 모드 여부
 * @property {string} clickedImageSrc - 클릭된 이미지의 소스 경로
 */
interface ViewerProps {
  videoRef: React.RefObject<HTMLVideoElement>
  isQrayDeviceStreamOn: boolean
  isCaptureMode: boolean
  clickedImageSrc: string
}

/**
 * 뷰어 메인 영역을 표시하는 컴포넌트.
 *
 * @function ViewerMain
 * @param {ViewerProps} props - 컴포넌트 프로퍼티들
 * @returns {JSX.Element}
 */
const ViewerMain = ({ videoRef, isQrayDeviceStreamOn, isCaptureMode, clickedImageSrc }: ViewerProps): JSX.Element => {
  return (
    <div className="flex w-full flex-col border-l-2 border-slate-500">
      <div className={`flex h-[7%] ${isQrayDeviceStreamOn ? "animate-blink" : ""} items-center pl-2`}>
        QrayStream {isQrayDeviceStreamOn ? "ON" : "OFF"}
      </div>
      <div className={`flex h-[93%] w-full justify-center ${isCaptureMode ? "" : "hidden"}`}>
        <video ref={videoRef} muted className={`h-full w-full object-cover ${isQrayDeviceStreamOn ? "" : "hidden"}`} />
        <div className={`flex flex-col items-center justify-center text-2xl  ${isQrayDeviceStreamOn ? "hidden" : ""}`}>
          <p>Qray device is not connected.</p>
          <p>After connecting the cables and turn on the power.</p>
          <div className="relative mt-6 h-[150px] w-[250px] flex-col">
            <Image
              src="/images/qray_yellow.jpeg"
              alt="Qray normal connection"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        </div>
      </div>
      {clickedImageSrc ? (
        <div className={`flex h-[95%] w-full justify-center ${isCaptureMode ? "hidden" : ""}`}>
          <div className="relative h-full w-full flex-col">
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
