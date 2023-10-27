import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { ConnectedDeviceInfo } from "types"

interface UseConnectedDevicesProps {
  deviceList: ConnectedDeviceInfo[]
  setDeviceList: Dispatch<SetStateAction<ConnectedDeviceInfo[]>>
  getConnectedDevices: () => Promise<void>
}

/**
 * 연결된 장치 목록을 가져오기 위한 커스텀 훅입니다.
 *
 * @param {string | undefined} selectedDeviceId - 선택된 장치의 ID입니다.
 * @returns {UseConnectedDevicesProps} 장치목록, setDeviceList 함수, getConnectedDevices 함수를 포함하는 객체입니다.
 */
const useConnectedDevices = (selectedDeviceId: string | undefined): UseConnectedDevicesProps => {
  const [deviceList, setDeviceList] = useState<ConnectedDeviceInfo[]>([])

  /**
   * 연결된 장치 목록을 가져와서 상태를 업데이트합니다.
   *
   * @returns {Promise<void>} 장치 목록이 업데이트되면 해결되는 Promise입니다.
   */
  const getConnectedDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const newDeviceList: ConnectedDeviceInfo[] = devices
        .filter(deviceInfo => deviceInfo.kind === "videoinput")
        .map(deviceInfo => ({
          deviceInfo,
          checked: deviceInfo.deviceId === selectedDeviceId
        }))
      setDeviceList(newDeviceList)
    } catch (error) {
      console.error("Error in enumerateDevices: ", error)
    }
  }

  useEffect(() => {
    let isUnmounted = false

    const getConnectedDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const newDeviceList: ConnectedDeviceInfo[] = devices
          .filter(deviceInfo => deviceInfo.kind === "videoinput")
          .map(deviceInfo => ({
            deviceInfo,
            checked: deviceInfo.deviceId === selectedDeviceId
          }))

        if (!isUnmounted) {
          setDeviceList(newDeviceList)
        }
      } catch (error) {
        console.error("Error in enumerateDevices: ", error)
      }
    }

    getConnectedDevices()

    return () => {
      isUnmounted = true
    }
  }, [selectedDeviceId])

  return { deviceList, setDeviceList, getConnectedDevices }
}

export default useConnectedDevices
