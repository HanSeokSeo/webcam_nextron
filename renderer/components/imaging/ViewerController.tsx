import { ConnectedDeviceInfo } from "@typings/imaging"
import { createRef, useEffect, useRef } from "react"
import { BrowserWindow, globalShortcut } from "electron"

/**
 * ViewerController 컴포넌트의 프로퍼티를 정의하는 인터페이스
 * @interface ViewerControllerProps
 * @property {boolean} isPlaying - 재생 상태 여부를 나타내는 값
 * @property {boolean} isCaptureMode - Capture or View
 * @property {ConnectedDeviceInfo[]} deviceList - 연결된 디바이스 목록
 * @property {any} handleCheckboxChange - 체크박스 변경 이벤트 핸들러 함수
 * @property {() => void} handleKeyDown - 키 다운 이벤트 핸들러 함수
 */
interface ViewerControllerProps {
  isPlaying: boolean
  isCaptureMode: boolean
  deviceList: ConnectedDeviceInfo[]
  handleCheckboxChange: any
  handleKeyDown: () => void
  setIsCaptureMode: React.Dispatch<React.SetStateAction<boolean>>
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
  isCaptureMode,
  deviceList,
  handleCheckboxChange,
  handleKeyDown,
  setIsCaptureMode
}: ViewerControllerProps): JSX.Element => {
  const captureRef = useRef<HTMLButtonElement | null>(null)
  const checkboxRefs = useRef<React.RefObject<HTMLInputElement>[]>([])

  const backToCaptureMode = () => {
    setIsCaptureMode(true)
  }

  const handleCaptureButton = () => {
    handleKeyDown()
    captureRef.current?.blur()
  }

  const handleInput = (device: ConnectedDeviceInfo, index: number) => {
    handleCheckboxChange(device)

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
    <div className="min-w-7xl flex h-1/5 w-full border-x-2 border-b-2 border-slate-500">
      <div className="flex w-2/5 flex-col">
        <div className="flex h-1/2">
          <button
            className="m-2 flex w-1/2 cursor-not-allowed items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white opacity-50 hover:bg-blue-600 active:bg-blue-700"
            disabled>
            {isPlaying ? "Stop" : "Start"}{" "}
          </button>
          <button
            ref={captureRef}
            className="m-2 w-1/2 rounded-md bg-yellow-500 px-4 py-2 hover:bg-yellow-600 active:bg-yellow-700"
            onClick={handleCaptureButton}>
            Capture
          </button>
        </div>
        <div className="flex h-1/2">
          <button
            className="m-2 w-full cursor-not-allowed rounded-md bg-red-500 px-4 py-2 opacity-50 hover:bg-red-600 active:bg-red-700"
            disabled>
            Record
          </button>
        </div>
      </div>
      <div className="flex p-2">
        <button
          className={`${
            isCaptureMode ? "cursor-not-allowed bg-gray-400" : "bg-green-500 hover:bg-green-700"
          } rounded text-white`}
          onClick={backToCaptureMode}
          disabled={isCaptureMode}>
          <span className="inline-block min-w-[100px]">
            {isCaptureMode ? (
              <>
                Capture <br />
                Mode
              </>
            ) : (
              <>
                View <br />
                Mode
              </>
            )}
          </span>
        </button>
      </div>
      <div className="w-3/5 py-2">
        <div className="flex h-[20%] items-center space-x-2">
          <div className="text-[1.25rem]">Connected Device List</div>
        </div>
        <div className="h-[80%] overflow-y-scroll">
          <ul className="mt-2 pl-2">
            {deviceList.map((device, key) => (
              <li key={key} className="mt-2 flex items-center">
                <input
                  ref={checkboxRefs.current[key]}
                  type="checkbox"
                  checked={device.checked}
                  className={`mr-2 h-5 w-5 ${key}`}
                  onChange={() => handleInput(device, key)}
                />
                {device.deviceInfo.label || `Device ${key + 1}`}
                <button onClick={() => console.log(device)}>Log Device</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ViewerController
