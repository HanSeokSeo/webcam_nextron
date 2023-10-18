import { useEffect, useState } from "react"
import { ipcRenderer } from "electron"
import path from "path"
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

  const openDirectoryDialog = async () => {
    ipcRenderer.send("open-directory-dialog")
  }

  useEffect(() => {
    ipcRenderer.on("selected-folder", (_, folderPath) => {
      const separator = platform === "macOS" ? "/" : `\\` // 운영 체제에 따라 적절한 경로 구분자를 설정합니다. (macOS의 경우 '/', 그 외의 경우 '\\')
      const parts = folderPath.split(separator)
      const result = parts.slice(1, 5).join(separator)
      const patient = parts.pop()

      setFolderPath(result)
      setSelectedPatient(patient)
    })

    ipcRenderer.on("selected-files", (_, filePaths) => {
      const fileList = filePaths.map((filePath: string) => ({
        name: path.basename(filePath),
        imgSrc: filePath
      }))

      setCapturedImages(fileList)

      return () => {
        ipcRenderer.removeAllListeners("selected-files")
      }
    })
  }, [platform])

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
