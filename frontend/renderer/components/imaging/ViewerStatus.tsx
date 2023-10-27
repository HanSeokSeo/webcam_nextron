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
  isActive
}: ViewerStatusProps): JSX.Element => {
  return (
    <div className="flex w-1/4 flex-col justify-between pl-2 pt-3">
      <div className="">
        <div className="3xl:text-2xl my-1 text-sm xl:text-base">DEVICE STATUS</div>
        <ul className="3xl:text-xl text-xs xl:mt-2 xl:text-sm">
          <li className="list-inside list-none indent-1.5 before:pr-1 before:text-lg before:content-['•'] xl:mb-2">
            COUNT : {count}
          </li>
          <li className="list-inside list-none indent-1.5 before:pr-1 before:text-lg before:content-['•'] xl:mb-2">
            PLATFORM : {platform}
          </li>
          <li className="list-inside list-none indent-1.5 before:pr-1 before:text-lg before:content-['•'] xl:mb-2">
            DEVICE_CHECK : {isDeviceChecked ? "ON" : "OFF"}
          </li>
          <li className="list-inside list-none indent-1.5 before:pr-1 before:text-lg before:content-['•'] xl:mb-2">
            QRAY_STREAM : {isQrayDeviceStreamOn ? "ON" : "OFF"}
          </li>
          <li className="list-inside list-none indent-1.5 before:pr-1 before:text-lg before:content-['•'] xl:mb-2">
            MUTED: {typeof isMuted === "boolean" ? (isMuted ? "TRUE" : "FALSE") : "undefined"}
          </li>
          <li className="list-inside list-none indent-1.5 before:pr-1 before:text-lg before:content-['•'] xl:mb-2">
            ACTIVE: {typeof isActive === "boolean" ? (isActive ? "TRUE" : "FALSE") : "undefined"}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ViewerStatus
