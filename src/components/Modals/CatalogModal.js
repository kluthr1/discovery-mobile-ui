import React, { useState } from 'react';
import {
  Modal, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies
import { connect } from 'react-redux';

import Colors from '../../constants/Colors';
import BaseText from '../Generic/BaseText';
import CollectionSegmentControl from '../SegmentControl/CollectionSegmentControl';
import MarkedSegmentControl from '../SegmentControl/MarkedSegmentControl';

const CatalogModal = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleClearCollection = () => {};

  const handleClearMarked = () => {};

  return (
    <View style={styles.root}>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeaderContainer}>
              <BaseText variant="sectionTitle">Record Filters</BaseText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.controlsContainer}>
              <CollectionSegmentControl />
              <MarkedSegmentControl />
              <TouchableOpacity style={styles.button} onPress={handleClearCollection}>
                <BaseText variant="buttonDestructive">Clear Collection</BaseText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleClearMarked}>
                <BaseText variant="buttonDestructive">Clear Highlighted Records</BaseText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Entypo name="dots-three-vertical" size={24} color={Colors.darkgrey} />
      </TouchableOpacity>
    </View>
  );
};

export default connect(null, null)(CatalogModal);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    shadowColor: 'black',
  },
  modalView: {
    height: '50%',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  controlsContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: Colors.lightgrey2,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
});