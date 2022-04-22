import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TextInput, Text,
          TouchableWithoutFeedback, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { shape } from 'prop-types';
import {
  Header, Title,
} from 'native-base';
import { Feather } from '@expo/vector-icons';

import CollectionRow from '../components/CollectionRow/CollectionRow';
import { customCollectionsSelector, prebuiltCollectionsSelector,
  collectionsCounterSelector, searchOnlyAllRecordsSelector,
  globalSearchTermSelector} from '../redux/selectors';
import HeaderCountIcon from '../components/Icons/HeaderCountIcon';
import Colors from '../constants/Colors';
import { updateSearchTerm, updateGlobalSearch } from '../redux/action-creators';
import BaseAccordion from '../components/Generic/BaseAccordion';

const SearchScreen = ({ navigation, collections, reports, records, collectionsCounter,
  searchTermFilter, globalSearchUpdate,searchTerm
 }) => {
  const [title, onChangeTitle] = useState(searchTerm);
  const [collectionsList, editCollectionsList] = useState(collections);
  const [reportsList, editreportsList] = useState(reports);
  useEffect(() => {
    searchTermFilter(title);
    globalSearchUpdate(title)
    console.log(searchTerm)
  }, [title]);


  return (
  <SafeAreaView style={styles.safeAreaView}>
    <Header style={styles.header}>
      <View style={styles.headerTitleContainer}>
        {/*collectionsCounter.preBuiltCount > 0 && (
        <HeaderCountIcon count={collectionsCounter.preBuiltCount} />
      )*/}
        <Title style={styles.headerText}>Search</Title>
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
    <TouchableWithoutFeedback>
      <ScrollView
        contentContainerStyle={styles.collectionRowContainer}
        keyboardShouldPersistTaps="handled"
      >
      <Text>

      </Text>
      {Object.entries(records).map(([id, { subType }]) => (
        <Text>{subType}</Text>
      ))}

       <Text>{"Collections"}</Text>

        {Object.entries(collectionsList).map(([id, { label }]) => (
          <CollectionRow
            key={id}
            collectionId={id}
            label={label}
            navigation={navigation}
          />
        ))}
        <Text>{"Reports"}</Text>
        {Object.entries(reportsList).map(([id, { label }]) => (
          <CollectionRow
            key={id}
            collectionId={id}
            label={label}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </TouchableWithoutFeedback>
    </View>
  </SafeAreaView>
)};

SearchScreen.propTypes = {
  navigation: shape({}).isRequired,
  collections: shape({}).isRequired,
  reports: shape({}).isRequired,
  records: shape({}).isRequired,
  collectionsCounter: shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  collections: customCollectionsSelector(state),
  reports:  prebuiltCollectionsSelector(state),
  records: searchOnlyAllRecordsSelector(state),
  collectionsCounter: collectionsCounterSelector(state),
  searchTerm: globalSearchTermSelector(state)

});
const mapDispatchToProps = {
  searchTermFilter: updateSearchTerm,
  globalSearchUpdate: updateGlobalSearch
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);

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
