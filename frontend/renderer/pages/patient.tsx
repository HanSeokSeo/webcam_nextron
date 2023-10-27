import { useQuery } from "@apollo/client";
import PatientListModal from "@components/modal/PatientListModal";
import GET_PATIENTS from "@lib/apollo/queries/getPatients";

const PatientTable = () => {
  const { loading, error, data } = useQuery(GET_PATIENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const patients = data?.patients || [];

  return <PatientListModal patients={patients} />
};

export default PatientTable;
