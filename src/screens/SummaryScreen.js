import React from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet, SafeAreaView, StatusBar, Button, BackHandler,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Colors from '../constants/Colors';
import { clearAuth } from '../features/auth/authSlice';
import { actionTypes } from '../redux/action-types';
import RecordsSummary from '../components/RecordsSummary/RecordsSummary';
import ProvidersSummary from '../components/ProvidersSummary/ProvidersSummary';

const Tab = createMaterialTopTabNavigator();

const SummaryScreen = ({
  clearAuthAction, clearPatientDataAction,
}) => {
  const clearData = () => {
    clearAuthAction();
    clearPatientDataAction();
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', clearData);

      return () => BackHandler.removeEventListener('hardwareBackPress', clearData);
    }, []),
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      <ScrollView style={styles.scrollContainer}>
        <Tab.Navigator
          initialRouteName="Records"
        >
          <Tab.Screen name="Records" component={RecordsSummary} />
          <Tab.Screen name="Providers" component={ProvidersSummary} />
        </Tab.Navigator>
        <Button title="Logout" onPress={clearData} />
      </ScrollView>
    </SafeAreaView>
  );
};

SummaryScreen.propTypes = {
  clearAuthAction: func.isRequired,
  clearPatientDataAction: func.isRequired,
};

const mapDispatchToProps = {
  clearAuthAction: clearAuth,
  clearPatientDataAction: () => ({
    type: actionTypes.CLEAR_PATIENT_DATA,
  }),
};

export default connect(null, mapDispatchToProps)(SummaryScreen);

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
});
