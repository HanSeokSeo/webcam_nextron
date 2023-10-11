import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { ConnectedDeviceInfo } from "types"

interface UseConnectedDevicesProps {
  deviceList: ConnectedDeviceInfo[]
  setDeviceList: Dispatch<SetStateAction<ConnectedDeviceInfo[]>>
  getConnectedDevices: () => Promise<void>
}

const useConnectedDevices = (selectedDeviceId: string | undefined): UseConnectedDevicesProps => {
  const [deviceList, setDeviceList] = useState<ConnectedDeviceInfo[]>([])

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
