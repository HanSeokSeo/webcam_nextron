/**
 * ViewerStatus 컴포넌트의 프로퍼티를 정의하는 인터페이스
 * @interface ViewerStatusProps
 * @property {number} count - 카운트 값
 * @property {string} platform - 플랫폼 정보
 * @property {boolean} isDeviceChecked - 디바이스 체크 여부
 * @property {boolean} isQrayDeviceStreamOn - Qray 디바이스 스트림 상태 여부
 * @property {(boolean|string)} isMuted - 음소거 상태 (boolean 또는 string 타입)
 * @property {(boolean|string)} isActive - 액티브 상태 (boolean 또는 string 타입)
 * @property {boolean} isCaptureMode - 캡처 모드 여부
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsCaptureMode - 캡처 모드 설정 함수
 */
interface ViewerStatusProps {
  count: number
  platform: string
  isDeviceChecked: boolean
  isQrayDeviceStreamOn: boolean
  isMuted: boolean | string
  isActive: boolean | string
  isCaptureMode: boolean
  setIsCaptureMode: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * 뷰어 상태를 표시하는 컴포넌트.
 *
 * @function ViewerStatus
 * @param {ViewerStatusProps} props - 컴포넌트 프로퍼티들
 * @returns {JSX.Element}
 */
const ViewerStatus = ({
  count,
  platform,
  isDeviceChecked,
  isQrayDeviceStreamOn,
  isMuted,
  isActive,
  isCaptureMode,
  setIsCaptureMode
}: ViewerStatusProps): JSX.Element => {
  const backToCaptureMode = () => {
    setIsCaptureMode(true)
  }
  return (
    <div className="flex-col w-1/4 pl-2 justify-between flex">
      <div className="">
        <div className="text-sm my-1">DEVICE STATUS</div>
        <ul className="text-xs">
          <li className="list-none list-inside indent-1.5 before:content-['•'] before:text-lg before:pr-1">
            COUNT : {count}
          </li>
          <li className="list-none list-inside indent-1.5 before:content-['•'] before:text-lg before:pr-1">
            PLATFORM : {platform}
          </li>
          <li className="list-none list-inside indent-1.5 before:content-['•'] before:text-lg before:pr-1">
            DEVICE_CHECK : {isDeviceChecked ? "ON" : "OFF"}
          </li>
          <li className="list-none list-inside indent-1.5 before:content-['•'] before:text-lg before:pr-1">
            QRAY_STREAM : {isQrayDeviceStreamOn ? "ON" : "OFF"}
          </li>
          <li className="list-none list-inside indent-1.5 before:content-['•'] before:text-lg before:pr-1">
            MUTED: {typeof isMuted === "boolean" ? (isMuted ? "TRUE" : "FALSE") : "undefined"}
          </li>
          <li className="list-none list-inside indent-1.5 before:content-['•'] before:text-lg before:pr-1">
            ACTIVE: {typeof isActive === "boolean" ? (isActive ? "TRUE" : "FALSE") : "undefined"}
          </li>
        </ul>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <div className="mr-2 text-lg font-bold">{isCaptureMode ? "Capture Mode" : "View Mode"}</div>
        <div>
          <button
            className={`${
              isCaptureMode ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-700"
            } text-white font-bold py-1 px-2 rounded text-xs`}
            onClick={backToCaptureMode}
            disabled={isCaptureMode}>
            Back to <br /> Capture mode
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewerStatus
