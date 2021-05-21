import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';

import Colors from '../../../constants/Colors';
import OBSectionBodyTemplate from '../components/OBSectionBodyTemplate';

// wireframe page 16
const OBCollections3 = () => (
  <OBSectionBodyTemplate title="Data Organization" subTitle="Collections">
    <Text style={styles.body}>
      Preview or edit Collection by sorting the relevant Records in
      a way that matters to your question.
    </Text>
    <View style={styles.image}>
      <Text>Image</Text>
    </View>
  </OBSectionBodyTemplate>
);

export default OBCollections3;

const styles = StyleSheet.create({
  body: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.lightgrey2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
