import React from 'react';
import {
  StyleSheet, Text, View, ScrollView,
} from 'react-native';

import SubTypeAccordionsContainer from '../SubTypeAccordion/SubTypeAccordionsContainer';

const ContentPanel = () => (
  <ScrollView>
    <View>
      <Text style={styles.title}>Content Panel</Text>
    </View>
    <SubTypeAccordionsContainer showAllResourceTypes />
  </ScrollView>
);

export default ContentPanel;

const styles = StyleSheet.create({
  title: {
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
  },
});