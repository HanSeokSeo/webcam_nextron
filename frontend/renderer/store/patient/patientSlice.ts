import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Patient } from '@typings/patient';


interface PatientState {
  patient: Patient | null;
}

const initialState: PatientState = {
  patient: null,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    selectPatient: (state, action: PayloadAction<Patient>) => {
      state.patient = action.payload;
    },
    clearPatient: (state) => {
      state.patient = null;
    },
  },
});

export const { selectPatient, clearPatient } = patientSlice.actions;

export default patientSlice.reducer;