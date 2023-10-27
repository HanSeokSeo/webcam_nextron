import Image from "next/image"
import { FaTrashAlt } from "react-icons/fa"
import { CapturedImage } from "@typings/imaging"
import { useEffect, useRef } from "react"

/**
 * ViewerImageList 컴포넌트의 프로퍼티를 정의하는 인터페이스
 * @interface ViewerImageListProps
 * @property {CapturedImage[]} capturedImages - 캡쳐된 이미지들의 배열
 * @property {(src: string) => void} showClickedImage - 이미지를 클릭했을 때 실행되는 함수
 * @property {React.Dispatch<React.SetStateAction<CapturedImage[]>>} setCapturedImages - 캡쳐된 이미지 배열을 설정하는 함수
 * @property {(imgSrc: string, setStateFunc: React.Dispatch<React.SetStateAction<CapturedImage[]>>) => void} deleteImage - 이미지를 삭제하는 함수
 */
interface ViewerImageListProps {
  capturedImages: CapturedImage[]
  showClickedImage: (src: string) => void
  setCapturedImages: React.Dispatch<React.SetStateAction<CapturedImage[]>>
  deleteImage: (imgSrc: string, setStateFunc: React.Dispatch<React.SetStateAction<CapturedImage[]>>) => void
}

/**
 * 이미지 목록을 표시하는 컴포넌트.
 *
 * @function ViewerImageList
 * @param {ViewerImageListProps} props - 컴포넌트 프로퍼티들
 * @returns {JSX.Element}
 */
const ViewerImageList = ({
  capturedImages,
  showClickedImage,
  setCapturedImages,
  deleteImage
}: ViewerImageListProps): JSX.Element => {
  const reversedPhotos = [...capturedImages].reverse()
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0
    }
  }, [capturedImages])

  return (
    <div
      className="scrollbar-thin flex h-4/5 w-full flex-col overflow-y-scroll border-y-2 border-l-2 border-slate-500"
      ref={listRef}>
      {reversedPhotos.map((photo, idx) => {
        if (photo && photo.imgSrc != null && photo.imgSrc != undefined) {
          return (
            <div className="relative flex flex-col border-b-2 border-slate-500 p-2" key={idx}>
              <Image
                className="rounded-md"
                src={photo.imgSrc}
                alt="Captured"
                width={400}
                height={300}
                onClick={() => showClickedImage(photo.imgSrc)}
              />
              <div className="m-1">{photo.name}</div>
              <button
                className="absolute right-0 top-0 m-2 p-1"
                onClick={() => deleteImage(photo.imgSrc, setCapturedImages)}>
                <FaTrashAlt size={15} />
              </button>
            </div>
          )
        }
      })}
    </div>
  )
}

export default ViewerImageList
