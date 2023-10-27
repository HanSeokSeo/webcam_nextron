import { ipcRenderer } from "electron";
import React from "react";
import { FaUser } from "react-icons/fa";

interface StyledButtonProps {
  buttonText: string;
}

const StyledButton: React.FC<StyledButtonProps> = ({ buttonText }) => {
  const handleClick = () => {
    ipcRenderer.send("show-patient-list");
  };

  return (
    <button
      onClick={handleClick}
      className="mr-3 p-2 px-2 text-sm text-gray-700 dark:bg-green-500 dark:bg-opacity-20 dark:text-gray-50 flex items-center bg-gray-200 rounded"
    >
      <FaUser className="mr-1" />
      {buttonText}
    </button>
  );
};

export default StyledButton;