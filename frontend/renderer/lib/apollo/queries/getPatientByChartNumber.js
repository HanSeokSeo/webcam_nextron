const GET_PATIENT_BY_CHART_NUMBER = gql`
  query GetPatientByChartNumber($chartNumber: String!) {
    patientByChartNumber(chartNumber: $chartNumber) {
        chartNumber
        namedateOfBirth
        gender
        attendingPhysician
    }
  }
`

export default GET_PATIENT_BY_CHART_NUMBER