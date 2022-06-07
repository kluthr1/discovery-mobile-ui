import React from 'react';
import {
  StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Text, View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Header, Body, Title,
} from 'native-base';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Colors from '../constants/Colors';
import UserInfo from '../components/Profile/UserInfo';
import Demographics from '../components/Profile/Demographics';
import Data from '../components/Profile/Data';
import Logout from '../components/Login/Logout';
import RecordsSummary from '../components/Summary/RecordsSummary';
import ProvidersSummary from '../components/Summary/ProvidersSummary';
import TextStyles from '../constants/TextStyles';

const Tab = createMaterialTopTabNavigator();

const ProfileScreen = () => (
  <SafeAreaView style={styles.root}>
    <StatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
    <Header style={styles.header}>
      <Body>
        <Title style={styles.headerText}>Profile</Title>
      </Body>
    </Header>
    <UserInfo />
    <ScrollView style={styles.scrollContainer}>
      <Demographics />
      <Data />

    <View style = {styles.horizontalPadding}>
      <Tab.Navigator
        initialRouteName="Records"
        style={styles.tabs}
        tabBarOptions={{
          labelStyle: styles.tabText,
          indicatorStyle: {
            backgroundColor: Colors.mediumgrey,
            height:1.5,
          },
        }}
      >
        <Tab.Screen
          name="Records"
          component={RecordsSummary}
        />
        <Tab.Screen
          name="Providers"
          component={ProvidersSummary}
        />
      </Tab.Navigator>
    </View>

    </ScrollView>

    <View style={styles.logoutContainer}>
      <Logout>
        <TouchableOpacity style={styles.logout}>
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </Logout>
    </View>

  </SafeAreaView>
);

export default ProfileScreen;

const { body1 } = TextStyles;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.logoBlue,
    height: 50,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
  },
  logout: {
    backgroundColor: Colors.logoBlue,
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
  },
  logoutContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  horizontalPadding:{
    paddingHorizontal:20,
    zIndex:-1,
    marginTop:-16,
  },
  tabText: {
    textTransform: 'none',
    marginBottom:-8,
    ...body1,
  },
});
