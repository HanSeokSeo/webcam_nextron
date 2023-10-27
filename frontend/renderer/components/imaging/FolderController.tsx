import { ipcRenderer } from "electron"
import path from "path"
import { useEffect, useState } from "react"
import { AiFillFolderAdd, AiFillFolderOpen } from "react-icons/ai"
import { BiExit } from "react-icons/bi"

/**
 * 캡쳐된 사진들을 나타내는 인터페이스
 * @interface CapturedPhotos
 * @property {string} name - 사진의 이름
 * @property {string} imgSrc - 사진의 소스 경로
 */
interface CapturedPhotos {
  name: string
  imgSrc: string
}

/**
 * FolderController 컴포넌트의 프로퍼티를 정의하는 인터페이스
 * @interface FolderControllerProps
 * @property {React.Dispatch<React.SetStateAction<CapturedPhotos[]>>} setCapturedImages - 캡쳐된 이미지들을 설정하는 함수
 * @property {string} platform - 사용중인 플랫폼 (예: "macOS", "Windows" 등)
 */
interface FolderControllerProps {
  setCapturedImages: React.Dispatch<React.SetStateAction<CapturedPhotos[]>>
  platform: string
}

/**
 * 디렉터리를 관리하고, 선택된 폴더와 환자 정보를 표시하는 컴포넌트.
 * 디렉터리 열기 버튼 클릭 시 Electron에서 제공하는 'open-directory-dialog' 이벤트를 발생시킵니다.
 * 선택된 폴더와 파일 정보는 ipcRenderer로부터 받아옵니다.
 *
 * @function FolderController
 * @param {FolderControllerProps} props - 컴포넌트 프로퍼티들
 * @returns {JSX.Element}
 */
const FolderController = ({ setCapturedImages, platform }: FolderControllerProps): JSX.Element => {
  const [folderPath, setFolderPath] = useState<string>("")
  const [selectedPatient, setSelectedPatient] = useState<string>("")

  // 디렉토리 다이얼로그 열기 함수
  const openDirectoryDialog = async () => {
    ipcRenderer.send("open-directory-dialog") // 메인 프로세스에 디렉토리 다이얼로그 열기 메시지 전송
  }

  useEffect(() => {
    // 디렉토리 선택 시 이벤트 핸들러
    const handleSelectedFolder = (folderPath: string) => {
      const separator = platform === "macOS" ? "/" : `\\`
      const parts = folderPath.split(separator)
      const result = parts.slice(1, 5).join(separator)
      const patient = parts.pop()

      setFolderPath(result)
      setSelectedPatient(patient || "")
    }

    // 선택된 파일 목록 이벤트 핸들러
    const handleSelectedFiles = (filePaths: string[]) => {
      const fileList: CapturedPhotos[] = filePaths.map((filePath: string) => ({
        name: path.basename(filePath),
        imgSrc: filePath
      }))

      // 상태 업데이트: 캡처된 이미지 목록 설정
      setCapturedImages(fileList)
    }

    ipcRenderer.on("selected-folder", (_, folderPath) => handleSelectedFolder(folderPath))
    ipcRenderer.on("selected-files", (_, filePath) => handleSelectedFiles(filePath))

    return () => {
      ipcRenderer.removeListener("selected-folder", handleSelectedFolder)
      ipcRenderer.removeListener("selected-files", handleSelectedFiles)
    }
  }, [platform, setCapturedImages])

  return (
    <div className="border-b-2 border-l-2 border-slate-500 h-1/5 p-2">
      <div className="h-[10%] flex justify-end">
        <AiFillFolderAdd
          title="Create Patient"
          size="24"
          className="hover:bg-gray-600 active:bg-gray-400 mr-2"
          onClick={openDirectoryDialog}
        />
        <AiFillFolderOpen
          title="Open Directory"
          size="24"
          className="hover:bg-gray-600 active:bg-gray-400 mr-2"
          onClick={openDirectoryDialog}
        />
        <BiExit
          title="Exit Application"
          size="24"
          className="hover:bg-gray-600 active:bg-gray-400"
          onClick={() => ipcRenderer.send("quit-app")}
        />
      </div>
      <div className="h-[40%] text-sm">
        <div className="h-1/2">Selected Folder : </div>
        <div className="pl-4 h-1/2">{folderPath}</div>
      </div>
      <div className="h-[40%] mt-2 text-sm ">
        <div className="h-1/3">Selected Patient : </div>
        <div className="h-2/3 text-2xl font-bold flex justify-center items-center">{selectedPatient}</div>
      </div>
    </div>
  )
}

export default FolderController
