import { gql } from "@apollo/client";

const GET_PATIENTS = gql`
  query {
    patients {
      chartNumber
      name
      dateOfBirth
      gender
      attendingPhysician
    }
  }
`;

export default GET_PATIENTS;
