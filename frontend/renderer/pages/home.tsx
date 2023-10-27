import ViewerContainer from "@components/imaging/ViewerContainer";
import TopBar from "@components/theme/TopBar";
import { NextPage } from "next";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

const Imaging: NextPage = () => {
  const [showTopBar, setShowTopBar] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowTopBar(true);
    }, 1000);
  }, []);

  return (
    <ThemeProvider attribute="class">
      <div className="flex-column h-screen">
        {showTopBar ? (
          <><TopBar /></>
        ) : (
          <div className="flex justify-end h-[5%] pr-4 items-center">
            <div className="w-6 h-6 border-t-4 border-green-500 border-solid rounded-full animate-spin" />
          </div>
        )}

        <ViewerContainer />
      </div>
    </ThemeProvider>
  );
};

export default Imaging;
