import { Patient } from "@typings/patient";
import { ipcRenderer } from "electron";
import { FaTimes } from "react-icons/fa";

interface PatientListProps {
  patients: Patient[];
}

const PatientListModal = ({ patients }: PatientListProps) => {
  const closeWindow = () => {
    ipcRenderer.send("close-patient-list"); // 메인 프로세스로 메시지 보내기
  };

  if (!patients) {
    return <p>Loading...</p>; // 데이터가 로딩 중일 때 표시
  }

  if (patients.length === 0) {
    return <p>No patients available.</p>; // 데이터가 없을 때 표시
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between z-10 sticky top-0">
        <div className="py-2 px-4 text-lg font-bold">Patient List</div>
        <button onClick={closeWindow} className="text-gray-600 py-2 px-4">
          <FaTimes />
        </button>
      </div>
      <div className="overflow-y-auto h-64">
        <table className="w-full border-collapse">
          <thead className="z-10 sticky top-0 bg-red-500 border-red-500 border-2">
            <tr>
              <th className="border border-black py-2 text-center">Chart Number</th>
              <th className="border border-black py-2 text-center">Name</th>
              <th className="border border-black py-2 text-center">Date of Birth</th>
              <th className="border border-black py-2 text-center">Gender</th>
              <th className="border border-black py-2 text-center">Attending Physician</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, id) => (
              <tr key={id}>
                <td className="border border-black py-2 text-center">{patient.chartNumber}</td>
                <td className="border border-black py-2 text-center">{patient.name}</td>
                <td className="border border-black py-2 text-center">{patient.dateOfBirth}</td>
                <td className="border border-black py-2 text-center">{patient.gender}</td>
                <td className="border border-black py-2 text-center">{patient.attendingPhysician}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientListModal;