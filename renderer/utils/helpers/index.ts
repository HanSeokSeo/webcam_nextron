import { MutableRefObject, useEffect, useRef } from "react"

//* 텍스트를 일정한 크기로 자르기
export function trimTextToLength(str: string | undefined, maxLength: number) {
  return str?.length! > maxLength ? str?.substring(0, maxLength) + "..." : str
}

export function getCurrentDateTime(): string {
  const now: Date = new Date()
  const options: Intl.DateTimeFormatOptions = {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }

  return now.toLocaleString(undefined, options)
}

//* debounce 구현
export default function debounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  let timeoutId: NodeJS.Timeout

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback.apply(this, args)
    }, delay)
  }
}

export function getAgentSystem(): string {
  const ua = navigator.userAgent
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)

  const platform = navigator.platform.toLowerCase()
  if (platform.startsWith("win")) return "Windows"
  if (platform.startsWith("mac")) return "macOS"
  if (platform.startsWith("linux")) return "Linux"

  return isMobile ? "mobile" : "unknown"
}

export function useDidMountEffect(func: () => void, deps: unknown) {
  const didMount = useRef(0)

  useEffect(() => {
    if (didMount.current === 5) func()
    else didMount.current += 1
  }, [deps])
}

export async function stopStream(
  videoRef: MutableRefObject<HTMLVideoElement | null | undefined>,
  checkedDeviceId: string | undefined
) {
  try {
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: checkedDeviceId } }
    })
    stream.getTracks().forEach(track => track.stop())

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  } catch (error) {
    console.log("Error occured while stop stream", error)
  }
}

export function startStream(
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  stream: MediaStream
) {
  if (videoRef.current) {
    videoRef.current.srcObject = null
    videoRef.current.srcObject = stream
    videoRef.current
      .play()
      .then(() => {
        console.log("Video playback started.")
      })
      .catch((e: any) => {
        console.log("Video playback failed", e)
      })
  }
}

function addKeyEvent(eventFunction: () => void) {
  window.addEventListener("keydown", eventFunction)
}
