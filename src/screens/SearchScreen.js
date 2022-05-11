import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TextInput, Text,
          TouchableWithoutFeedback, ScrollView , TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { shape } from 'prop-types';
import {
  Header, Title,
} from 'native-base';
import { Feather } from '@expo/vector-icons';

import CollectionRow from '../components/CollectionRow/CollectionRow';
import { customCollectionsSelector, reportsFilteredByGlobalSearch,
  collectionsCounterSelector,
  globalSearchTermSelector, groupedRecordsFilteredByGlobalSearch,
  collectionsFilteredByGlobalSearch, recordsFilteredByGlobalSearch,
  collectionsLabelsSelector} from '../redux/selectors';
import HeaderCountIcon from '../components/Icons/HeaderCountIcon';
import Colors from '../constants/Colors';
import { updateSearchTerm, updateGlobalSearch, createCollection,
  selectCollection, addResourceToCollection} from '../redux/action-creators';
import SearchAccordionsContainer from '../components/SubTypeAccordionsContainer/SearchAccordionsContainer';



const SearchScreen = ({ navigation, collections, reports, records, collectionsCounter,
  searchTermFilter, globalSearchUpdate,searchTerm, allRecords,
   createCollectionAction, addResourceToCollectionAction, allCollections,
  selectCollectionAction, collectionsLabels
 }) => {
  const [title, onChangeTitle] = useState(searchTerm);
  const [collectionsText, setCollectionsText] = useState((Object.keys(collections).length == 1) ?
                              "1 Collection" : Object.keys(collections).length  + " Collections");
  const [reportsText, setReportsText] = useState((Object.keys(reports).length == 1) ?
                              "1 Report" : Object.keys(reports).length  + " Reports");
  const [recordsText, setRecordsText] = useState((allRecords.length == 1) ?
                              "1 Records" : allRecords.length  + " Records");
  const [moveToCatalog, setMoveToCatalog] = useState(false);
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [newCollectionID, setCollectionID] = useState('');
  const [recordsToAdd, setRecordsToAdd] = useState([]);
  useEffect(() => {
    searchTermFilter(title);
    globalSearchUpdate(title)
    setCollectionsText((Object.keys(collections).length == 1) ?
                                "1 Collection" : Object.keys(collections).length  + " Collections")

    setReportsText((Object.keys(reports).length == 1) ?
                                "1 Report" : Object.keys(reports).length  + " Reports")
    setRecordsText((allRecords.length == 1) ?
                                "1 Records" : allRecords.length  + " Records")

  }, [title]);

  useEffect(() => {
    if (isAddingCollection) {
      selectCollectionAction(Object.keys(allCollections)[Object.keys(allCollections).length - 1]);
      if (moveToCatalog) {
        setMoveToCatalog(false)
        setIsAddingCollection(false);
        addResourceToCollectionAction(Object.keys(allCollections)[Object.keys(allCollections).length - 1],
                                      recordsToAdd)

        navigation.navigate('Catalog');
      }

    }

    // if (useState(collections )!== collections) {
    // }
  }, [collections, isAddingCollection, moveToCatalog]);
  useEffect(() => {
    var recordIds = []
    for (var i =0; i< allRecords.length; i++){
      recordIds.push(allRecords[i]["id"])
    }
    setRecordsToAdd(recordIds)
  }, [allRecords]);

  const isUniqueName = ({ text, isRename, label }) => {
    // if action is rename, new label can be same as old label
    if (isRename && (text.toLowerCase() === label.toLowerCase())) {
      return true;
    }
    return !((collectionsLabels).includes(text.toLowerCase()));
  };
  const hasMinLength = (text) => text.length > 0;

  const hasInputErrors = ({ text, isRename, label }) => {
    if (!hasMinLength(text)) {
      return true;
    }
    if (!isUniqueName({ text, isRename, label })) {
      return true;
    }
    return false;
  };

  const saveAndContinue = () => {
        if (title) {
          if (hasInputErrors({ text: title, isRename: false, label: title })) {
            return;
          }
          createCollectionAction(title);
          setCollectionID(Object.keys(allCollections)[Object.keys(allCollections).length - 1]);
          selectCollectionAction(Object.keys(allCollections)[Object.keys(allCollections).length - 1]);
          addResourceToCollectionAction(Object.keys(allCollections)[Object.keys(allCollections).length - 1],
                                        recordsToAdd)
          setIsAddingCollection(true);
          setMoveToCatalog(true);
        }
  };
  return (
  <SafeAreaView style={styles.safeAreaView}>
    <Header style={styles.header}>
      <View style={styles.headerTitleContainer}>
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
    <View style={styles.searchResultsContainer}>
      <ScrollView
        contentContainerStyle={styles.collectionRowContainer}
        keyboardShouldPersistTaps="handled"
      >
      <View style = {styles.textWrapper}>
        <Text style={styles.labelText}>
        {recordsText}
        </Text>

        <TouchableOpacity style={styles.typeTextPill}
        onPress={saveAndContinue}
        >
          <Text style={styles.typeText}>
            {"Timeline"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scrollView}>
        <SearchAccordionsContainer
          data={records}
          fromDetailsPanel
        />
      </View>
        <View style = {styles.textWrapper}>
          <Text style={styles.labelText}>{collectionsText}</Text>
       </View>
       <View style = {styles.collectionsContainer}>
        {Object.entries(collections).map(([id, { label }]) => (
          <CollectionRow
            key={id}
            collectionId={id}
            label={label}
            navigation={navigation}
          />
        ))}
        </View>

        <View style = {styles.textWrapper}>

        <Text style={styles.labelText}>{reportsText}</Text>

        </View>

        {Object.entries(reports).map(([id, { label }]) => (
          <CollectionRow
            key={id}
            collectionId={id}
            label={label}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </View>
    <View style = {styles.bottomMargin}>
    </View>
    </View>
  </SafeAreaView>
)};

SearchScreen.propTypes = {
  navigation: shape({}).isRequired,
  collections: shape({}).isRequired,
  reports: shape({}).isRequired,
  records: shape({}).isRequired,
  collectionsCounter: shape({}).isRequired,
  collectionsLabels: shape([]).isRequired,

};

const mapStateToProps = (state, ownProps) => ({
  allCollections: customCollectionsSelector(state, ownProps),
  collections: collectionsFilteredByGlobalSearch(state),
  reports:  reportsFilteredByGlobalSearch(state),
  collectionsCounter: collectionsCounterSelector(state),
  searchTerm: globalSearchTermSelector(state),
  records: groupedRecordsFilteredByGlobalSearch(state),
  allRecords: recordsFilteredByGlobalSearch(state),
  collectionsLabels: collectionsLabelsSelector(state),

});
const mapDispatchToProps = {
  createCollectionAction: createCollection,
  selectCollectionAction: selectCollection,
  searchTermFilter: updateSearchTerm,
  addResourceToCollectionAction: addResourceToCollection,

  globalSearchUpdate: updateGlobalSearch
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);

const styles = StyleSheet.create({
  safeAreaView: {
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
    paddingBottom:0,
    paddingHorizontal:6

  },
  numResultsView: {
    paddingTop: 10,
    width:'100%',
  },
  scrollView:{
    width:'100%',
    paddingTop:10,

  },
  labelText:{
    fontSize: 16,
    paddingVertical:5,
    paddingTop:3

  },
  searchResultsContainer:{
    width:"100%",
    marginBottom:200,
  },
  textWrapper:{
    width:"100%",
    paddingTop:6,
    textAlign:"left",
    paddingLeft:10,
    flex:1,
    flexDirection:"row"
  },

  bottomMargin:{
  },
  collectionsContainer:{
    width:'100%',
    paddingBottom:10,
    paddingTop:0
  },
  dash: {
    paddingLeft: 0,
    paddingRight: 8,
    fontSize: 16,
  },
  typeTextPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    marginLeft:"auto",
    marginRight: 20,
  },
});
