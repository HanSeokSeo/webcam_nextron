import { NextPage } from "next"
import Head from "next/head"
import ViewerContainer from "@components/imaging/ViewerContainer"

const Imaging: NextPage = () => {
  return (
    <div className="flex flex-row h-screen">
      <ViewerContainer />
    </div>
  )
}

export default Imaging
