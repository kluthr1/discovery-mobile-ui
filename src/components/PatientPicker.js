import React from 'react';
import { func, string, bool } from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PATIENTS = {
  '86512c6f-caf6-41f4-9503-e4270b37b94f': 'Mr. Blake Eichmann',
  '87a339d0-8cae-418e-89c7-8651e6aab3c6': 'Mrs. Danae Kshlerin',
  '689892bd-dcbe-41fc-8651-38a1d0893854': 'Mrs. Aundrea Grant',
  '494743a2-fea5-4827-8f02-c2b91e4a4c9e': 'Mr. Barrett Cummings',
  'd64b37f5-d3b5-4c25-abe8-23ebe8f5a04e': 'Mr. Benito Lucio',
  '57a5a683-f51e-4976-ad1d-c2c4d3385cec': 'Ms. Beatriz Salazar',
  'bf3cb50a-d753-4ddc-ad83-839250edcba': 'Ms. Angelita Howe',
  'ab4e7a7d-8b0d-41e1-9ce9-3877d7615aed': 'Mrs. Renea Quigley',
};

export const DEFAULT_PATIENT_ID = Object.keys(PATIENTS)[0];

const PatientPicker = ({ loading, patientId, setPatientId }) => !loading && (
  <View>
    <View style={styles.label}><Text>Select Example Patient:</Text></View>
    <Picker
      selectedValue={patientId}
      onValueChange={(itemValue) => setPatientId(itemValue)}
      style={styles.picker}
    >
      {Object.entries(PATIENTS).map(([id, name]) => (
        <Picker.Item
          key={id}
          value={id}
          label={name}
        />
      ))}
    </Picker>
  </View>
);

PatientPicker.propTypes = {
  loading: bool.isRequired,
  patientId: string.isRequired,
  setPatientId: func.isRequired,
};

export default PatientPicker;

const styles = StyleSheet.create({
  label: {
    alignItems: 'center',
    marginTop: 0,
  },
  picker: {
    height: 60,
    width: 600,
  },
});