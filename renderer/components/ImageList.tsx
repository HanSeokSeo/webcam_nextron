import Image from "next/image"
import { FaTrashAlt } from "react-icons/fa"
import { CapturedImage } from "types"

function ImageList({
  capturedImages,
  showClickedImage,
  setCapturedImages,
  deleteImage
}: {
  capturedImages: CapturedImage[]
  showClickedImage: (src: string) => void
  setCapturedImages: React.Dispatch<React.SetStateAction<CapturedImage[]>>
  deleteImage: (
    imgSrc: string,
    setStateFunc: React.Dispatch<React.SetStateAction<CapturedImage[]>>
  ) => void
}) {
  const reversedPhotos = [...capturedImages].reverse()

  return (
    <div className="flex flex-col overflow-y-scroll scrollbar-thin border-slate-500 border-l-2 border-y-2 w-full h-4/5">
      {reversedPhotos.map((photo, idx) => {
        if (photo && photo.imgSrc != null && photo.imgSrc != undefined) {
          return (
            <div
              className="relative flex flex-col border-slate-500 border-b-2 p-2"
              key={idx}>
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
                className="absolute top-0 right-0 p-1 m-2"
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

export default ImageList
