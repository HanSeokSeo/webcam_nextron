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
    <div className="flex flex-col w-full border-l-2 border-slate-500">
      <div className="h-[5%] ml-3 mt-3 ">QrayStream {isQrayDeviceStreamOn ? "ON" : "OFF"}</div>
      <div className={`h-[95%] w-full flex justify-center ${isCaptureMode ? "" : "hidden"}`}>
        <video ref={videoRef} muted className={`object-cover w-full h-full ${isQrayDeviceStreamOn ? "" : "hidden"}`} />
        <div className={`flex flex-col items-center justify-center text-2xl  ${isQrayDeviceStreamOn ? "hidden" : ""}`}>
          <p>Qray device is not connected.</p>
          <p>After connecting the cables and turn on the power.</p>
          <div className="w-[250px] h-[150px] relative flex-col mt-6">
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
        <div className={`h-[95%] w-full flex justify-center ${isCaptureMode ? "hidden" : ""}`}>
          <div className="w-full h-full relative flex-col">
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
