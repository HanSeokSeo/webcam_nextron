import { useState } from "react"
import { ConnectedDeviceInfo } from "types"

// 컴에 연결된 기기 중에서 선택한 기기 확인
const useConnectedDevices = (selectedDeviceId: string | undefined) => {
  const [deviceList, setDeviceList] = useState<ConnectedDeviceInfo[]>([]) // 현재 연결된 기기 목록

  // 연결되어 있는 기기 확인
  async function getConnectedDevices() {
    const newDeviceList: ConnectedDeviceInfo[] = []

    try {
      await navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.forEach(deviceInfo => {
          const checkedValue = deviceInfo.deviceId === selectedDeviceId
          if (deviceInfo.kind === "videoinput") {
            const newElement = { deviceInfo, checked: checkedValue }
            newDeviceList.push(newElement)
          }
        })
      })

      // 새로운 기기 목록 값으로 상태값을 변경
      setDeviceList(newDeviceList)
    } catch (error) {
      console.log("Error in enumerateDevices: ", error)
    }
  }

  return { deviceList, setDeviceList, getConnectedDevices }
}

export default useConnectedDevices
