import { ConnectedDeviceInfo } from "types"
import { createRef, useEffect, useRef } from "react"
import { BrowserWindow, globalShortcut } from "electron"

/**
 * ViewerController 컴포넌트의 프로퍼티를 정의하는 인터페이스
 * @interface ViewerControllerProps
 * @property {boolean} isPlaying - 재생 상태 여부를 나타내는 값
 * @property {ConnectedDeviceInfo[]} deviceList - 연결된 디바이스 목록
 * @property {any} handleCheckboxChange - 체크박스 변경 이벤트 핸들러 함수
 * @property {() => void} handleKeyDown - 키 다운 이벤트 핸들러 함수
 */
interface ViewerControllerProps {
  isPlaying: boolean
  deviceList: ConnectedDeviceInfo[]
  handleCheckboxChange: any
  handleKeyDown: () => void
}

/**
 * 뷰어 컨트롤러 컴포넌트.
 * 재생 버튼, 캡처 버튼, 디바이스 목록을 표시하고 관리합니다.
 *
 * @function ViewerController
 * @param {ViewerControllerProps} props - 컴포넌트 프로퍼티들
 * @returns {JSX.Element}
 */
const ViewerController = ({
  isPlaying,
  deviceList,
  handleCheckboxChange,
  handleKeyDown
}: ViewerControllerProps): JSX.Element => {
  const captureRef = useRef<HTMLButtonElement | null>(null)
  const checkboxRefs = useRef<React.RefObject<HTMLInputElement>[]>([])

  const handleCaptureButton = () => {
    handleKeyDown()
    captureRef.current?.blur()
  }

  const handleInput = (deviceId: string, deviceLabel: string, index: number) => {
    handleCheckboxChange(deviceId, deviceLabel)

    const isProduction: boolean = process.env.NODE_ENV === "production"

    // 개발모드 & 프로덕션 모드 구분하여 체크박스 포커스 해제 실행
    if (isProduction) {
      const blurShortcut = globalShortcut.register("Escape", () => {
        globalShortcut.unregister("Escape")
      })

      if (!blurShortcut) {
        console.error("Failed to register global shortcut")
      }
    } else {
      checkboxRefs.current[index].current?.blur()
    }
  }

  useEffect(() => {
    checkboxRefs.current = Array(deviceList.length)
      .fill(0)
      .map((_, i) => checkboxRefs.current[i] ?? createRef())
  }, [deviceList])

  return (
    <div className="flex w-full min-w-7xl h-1/5 border-slate-500 border-x-2 border-b-2">
      <div className="flex flex-col w-2/5">
        <div className="flex h-1/2">
          <button
            className="flex items-center justify-center w-1/2 px-4 py-2 m-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 active:bg-blue-700 opacity-50 cursor-not-allowed"
            disabled>
            {isPlaying ? "Stop" : "Start"}{" "}
          </button>
          <button
            ref={captureRef}
            className="w-1/2 px-4 py-2 m-2 bg-yellow-500 rounded-md hover:bg-yellow-600 active:bg-yellow-700"
            onClick={handleCaptureButton}>
            Capture
          </button>
        </div>
        <div className="flex h-1/2">
          <button
            className="w-full px-4 py-2 m-2 bg-red-500 rounded-md hover:bg-red-600 active:bg-red-700 opacity-50 cursor-not-allowed"
            disabled>
            Record
          </button>
        </div>
      </div>
      <div className="w-3/5 py-2">
        <div className="flex items-center space-x-2 h-[20%]">
          <div className="text-[1.25rem]">Connected Device List</div>
        </div>

        <div className="overflow-y-scroll h-[80%]">
          <ul className="pl-2 mt-2">
            {deviceList.map((device, key) => (
              <li key={key} className="flex items-center mt-2">
                <input
                  ref={checkboxRefs.current[key]}
                  type="checkbox"
                  checked={device.checked}
                  className={`mr-2 w-5 h-5 ${key}`}
                  onChange={() => handleInput(device.deviceInfo.deviceId, device.deviceInfo.label, key)}
                />
                {device.deviceInfo.label || `Device ${key + 1}`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ViewerController
