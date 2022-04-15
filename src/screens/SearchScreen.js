import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TextInput, Text} from 'react-native';
import { connect } from 'react-redux';
import { shape } from 'prop-types';
import {
  Header, Title,
} from 'native-base';
import { Feather } from '@expo/vector-icons';

import CollectionRow from '../components/CollectionRow/CollectionRow';
import { prebuiltCollectionsSelector, collectionsCounterSelector } from '../redux/selectors';
import HeaderCountIcon from '../components/Icons/HeaderCountIcon';
import Colors from '../constants/Colors';

const SearchScreen = ({ navigation, collections, collectionsCounter }) => {
  const [title, onChangeTitle] = useState('');
  const [validReports, setValidReports] = useState(collections)
  Object.size = function (obj) {
    let size = 0;
    Object.keys(obj).forEach(() => {
      size += 1;
    });
    if (size === 1) {
      return ('1 Result');
    }
    return (`${size.toString()} Results`);
  };
  useEffect(() => {
    const newCollectionsList = {};
    const itemsList = [];
    const itemNames = [];
    const collectionNames = [];
    if (Object.keys(collections).length > 0) {
      Object.keys(collections).forEach((key) => {
        if (collections[key] != null && title != null) {
            var words = title.toLowerCase().split(' ');
            var to_add = true
            for (var word in words){
              if(!collections[key].label.toLowerCase().includes(words[word])){
                to_add = false
              }
            }
            if (to_add){
              newCollectionsList[key] = collections[key]
            }
        }
      });
    }

    setValidReports(newCollectionsList);
  }, [title, collections]);
  return (
  <SafeAreaView style={styles.safeAreaView}>
    <Header style={styles.header}>
      <View style={styles.headerTitleContainer}>
        {collectionsCounter.preBuiltCount > 0 && (
        <HeaderCountIcon count={collectionsCounter.preBuiltCount} />
        )}
        <Title style={styles.headerText}>Reports</Title>
      </View>
    </Header>
    <View style ={styles.borderPadding} >
      <View style={styles.textInputContainer}>
      <View style={styles.iconPadding}>
        <Feather name="search" size={20} />
      </View>
        <TextInput
          style={styles.textInput}
          value={title}
          onChangeText={onChangeTitle}
          placeholder="search Reports"
          placeholderTextColor="#777777"
          autoFocus
        />
      </View>
    </View>
    <View style={(! title.length == 0 )? styles.numResultsView : { display: 'none' }}>

    </View>
  </SafeAreaView>
)};

SearchScreen.propTypes = {
  navigation: shape({}).isRequired,
  collections: shape({}).isRequired,
  collectionsCounter: shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  collections: prebuiltCollectionsSelector(state),
  collectionsCounter: collectionsCounterSelector(state),
});

export default connect(mapStateToProps, null)(UpdatesScreen);

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
  },
  collectionRowContainer: {
    alignItems: 'center',
  },
  header: {
    backgroundColor: Colors.headerBackground,
    height: 50,
  },
  headerText: {
    color: 'black',
    fontSize: 18,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputContainer: {
    paddingHorizontal: 0,
    margin: 1,
    padding: 1,
    paddingLeft:2,
    paddingRight:2,

    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderWidth: 0.5,


  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 8,
    flex: 1,
    alignItems: 'stretch',
  },
  iconPadding:{
        paddingTop: 5,
        paddingLeft:3
  },
  borderPadding:{
    paddingTop:10,
    paddingBottom:8,

    paddingHorizontal:6

  },
  numResultsView: {
    paddingTop: 10,
    paddingLeft: 7,
    flexDirection: 'row',
  },
  dash: {
    paddingLeft: 0,
    paddingRight: 8,
    fontSize: 16,
  },
});
