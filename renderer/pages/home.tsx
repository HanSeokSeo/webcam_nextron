import { NextPage } from "next"
import ViewerContainer from "@components/imaging/ViewerContainer"
import TopBar from "@components/theme/TopBar"

const Imaging: NextPage = () => {
  return (
    <div className="flex-column h-screen">
      <TopBar />
      <ViewerContainer />
    </div>
  )
}

export default Imaging
