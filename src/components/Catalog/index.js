import React, { useState, useEffect, useRef } from 'react';
import { arrayOf, shape, func} from 'prop-types';
import {
  StyleSheet, View, TouchableOpacity, ScrollView, Text, TextInput, Fragment
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

import { connect, useSelector } from 'react-redux';
import {
  Header, Right, Title, Left,
} from 'native-base';
import { Entypo, Feather, MaterialCommunityIcons } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies

import Timeline from '../Timeline';

import ResourceTypePicker from '../ResourceTypePicker';
import SubTypeAccordionsContainer from '../SubTypeAccordionsContainer';
import {
  activeCollectionResourceIdsSelector,
  activeCollectionSelector, selectedRecordsGroupedByTypeSelector,
  savedRecordsSelector, timelineIntervalsSelector,
  allValidRecordsSortedByDateSelector,
  activeSearchFilterSelector} from '../../redux/selectors';
import { updateSearchTerm } from '../../redux/action-creators';
import CatalogModal from '../Modals/CatalogModal';
import FilterDrawer from '../FilterDrawer';
import { AutocompleteDropdown } from '../AutoComplete'

import Colors from '../../constants/Colors';
import HeaderCountIcon from '../Icons/HeaderCountIcon';
import TextStyles from '../../constants/TextStyles';
import CollectionIcon from '../Icons/CollectionIcon';
import CollectionIconWithUndo from '../Icons/CollectionIconWithUndo';
import CollectionsDialog, { COLLECTIONS_DIALOG_ACTIONS, CollectionsDialogText } from '../Dialog/CollectionsDialog';

const CatalogScreenHeader = ({ collection, navigation }) => {
  const [collectionsDialogText, setCollectionsDialogText] = useState();

  const savedRecords = useSelector(savedRecordsSelector).length;
  return (
    <Header style={styles.header}>
      <Left>
        {/* }<TouchableOpacity onPress={() => navigation.goBack()}> */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-thin-left" size={20} color={Colors.headerIcon} />
        </TouchableOpacity>
      </Left>
      <TouchableOpacity style={styles.headerTitleContainer}
        onPress={()=>
          setCollectionsDialogText(CollectionsDialogText[COLLECTIONS_DIALOG_ACTIONS.RENAME])}>
          {collectionsDialogText && (
          <CollectionsDialog
            collectionId={collection.id}
            collectionLabel={collection?.label}

            collectionsDialogText={collectionsDialogText}
            setCollectionsDialogText={setCollectionsDialogText}
          />
          )}
        <HeaderCountIcon count={savedRecords} outline />
        <Title style={styles.collectionLabel}>{collection?.label}</Title>
      </TouchableOpacity>
      <Right>

        <CatalogModal collectionId={collection.id} />
      </Right>
    </Header>
  );
};

CatalogScreenHeader.propTypes = {
  collection: shape({}).isRequired,
  navigation: shape({}).isRequired,
};

CatalogScreenHeader.defaultProps = {
};


function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}


const Catalog = ({
  collection,
  selectedRecordsGroupedByType,
  navigation,
  timelineIntervals,
  allRecords,
  searchSelector,
  searchTermFilter,
  collectionResourceIds,
}) => {
  const noRecords = timelineIntervals.recordCount === 0;
  const [selectedItem, setSelectedItem] = useState(null)
  const [autoFillRecords, setAutoFillRecords] = useState([])
  const [resourceIds, setResourceIds] = useState([])
  const [searchRecordText, setSearchRecordText] = useState("")
  const [selectedItem2, setSelectedItem2] = useState(null)
  const [numTotalRecords, setNumTotalRecords] = useState("")
  const [numCollectionRecords, setNumCollectionRecords] = useState("")
  const [revertedCollectionRecords, setRevertedCollectionRecords] = useState("")
  const [revertedHighlightedRecords, setRevertedHighlightedRecords] = useState("")

  const prevRecord = usePrevious(searchRecordText);



  useEffect(() => {
    searchTermFilter(searchRecordText);
    var newAutoFill = []
    var storeResourceIds = []
    var totalRecords = 0;
    var collectionRecords  = 0;
    var previousRecords = []
    var prevHighlightedRecords = []

    for (var i in allRecords){
      var string = allRecords[i]["subType"]
      var to_add = true
      var words = searchRecordText.split(' ')
      for (var j in words){
        if(!string.toLowerCase().includes(words[j].toLowerCase())){
          to_add = false
        }
      }

      if(to_add){
        storeResourceIds.push(allRecords[i].id)
        totalRecords = totalRecords + 1;
        if (collectionResourceIds[allRecords[i].id]){
          collectionRecords = collectionRecords + 1;
          previousRecords.push(allRecords[i].id)
        }
        if(collection["records"][allRecords[i].id]){
          if(collection["records"][allRecords[i].id].highlight > 0){
            prevHighlightedRecords.push(allRecords[i].id)
          }
        }

      }

      newAutoFill.push(allRecords[i]["subType"])

      //subType.toLowerCase().includes(filter["searchTerms"][x].toLowerCase()
    }
    if(typeof prevRecord !== 'undefined' && typeof searchRecordText !== 'undefined'){

        if(prevRecord.length != searchRecordText.length){
        setRevertedCollectionRecords(previousRecords)
        setRevertedHighlightedRecords(prevHighlightedRecords)

      }
    }
    var unique = newAutoFill.filter((v, i, a) => a.indexOf(v) === i);
    newAutoFill = []

    for (var i in unique){

      newAutoFill.push({id: i, title: unique[i]})

    }
    setNumTotalRecords((totalRecords).toString() + " Records found")
    setNumCollectionRecords((collectionRecords).toString() + " saved in Collection")

    setAutoFillRecords(newAutoFill)
    setResourceIds(storeResourceIds)

  }, [allRecords, searchRecordText, collectionResourceIds]);


  let suggestionsListComponent;

  suggestionsListComponent = (
    <ScrollView nestedScrollEnabled={true} style = {styles.suggestedListStyles}>
        {autoFillRecords.map((item, index) => {
            return (
                <Text key={item[index]}>
                    {item[index]}
                </Text>
            );
        })}
    </ScrollView>
      );


  return (
    <PanGestureHandler
      activeOffsetX={-10}
      failOffsetX={[-20, 0]}
      onGestureEvent={() => navigation.navigate('CollectionDetails')}
    >

      <View style={styles.drawerContainer}>
        <FilterDrawer>
          <View style={styles.searchDropDownWrapper}>
            <CatalogScreenHeader collection={collection} navigation={navigation} />
            { searchRecordText.length != 0 && (
                     <View style={styles.textRow}>
                       <Text variant="title" style={styles.formHeader}>{numTotalRecords}</Text>
                       <Text variant="title" style={styles.formHeader}>{numCollectionRecords}</Text>

                     </View>
                     )}

            <View  style = {styles.borderWrap}>


            <View style={(searchRecordText == "" ? styles.searchInputContainer : styles.searchInputContainer)}>
              <AutocompleteDropdown
                  clearOnFocus={false}
                  closeOnBlur={false}
                  closeOnSubmit={false}
                  resetOnClose = {false}
                  initialValue={{ id: '1' }} // or just '2'
                  onChangeText={setSearchRecordText}
                  dataSet={autoFillRecords}
                  collectionId={collection['id']}
                  resourceIds={resourceIds}
                  previousResourceIds = {revertedCollectionRecords}
                  previousHighlightIds = {revertedHighlightedRecords}
                />

              </View>
              { searchRecordText != "" &&
                <View style={styles.collectionIconWrapper}>
              </View>}

            </View>
          </View>

          <Timeline noRecords={noRecords} />
          {noRecords && (
          <View style={styles.zeroStateContainer}>
            <Text style={styles.zeroStateText}>
              no Records to visualize
            </Text>
          </View>
          )}
          <ResourceTypePicker noRecords={noRecords}  />

          {!noRecords && (

          <>

            <ScrollView style={styles.scrollView}>
              <SubTypeAccordionsContainer data={selectedRecordsGroupedByType} />
            </ScrollView>


          </>
          )}


        </FilterDrawer>

      </View>

    </PanGestureHandler>

  );
};

Catalog.propTypes = {
  collection: shape({}).isRequired,
  selectedRecordsGroupedByType: arrayOf(shape({}).isRequired).isRequired,
  navigation: shape({}).isRequired,
  timelineIntervals: shape({}).isRequired,
  allRecords: arrayOf(shape({})).isRequired,
  searchSelector: shape({}).isRequired,
  searchTermFilter: func.isRequired,
  collectionResourceIds: shape({}).isRequired,

};

const mapStateToProps = (state) => ({
  collection: activeCollectionSelector(state),
  selectedRecordsGroupedByType: selectedRecordsGroupedByTypeSelector(state),
  timelineIntervals: timelineIntervalsSelector(state),
  allRecords: allValidRecordsSortedByDateSelector(state),
  searchSelector: activeSearchFilterSelector(state),
  collectionResourceIds: activeCollectionResourceIdsSelector(state),

});
const mapDispatchToProps = {
  searchTermFilter: updateSearchTerm,
};

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);

const { h5 } = TextStyles;

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.headerBackground,
    alignItems: 'center',
    elevation: 0,
    height: 50,
  },
  scrollView: {
    flex: 1,
    zIndex: -1,
  },
  collectionLabel: {
    color: 'black',
    fontSize: 18,
  },
  drawerContainer: {
    flex: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zeroStateContainer: {
    height:191,
    paddingTop:60,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex:-1,
  },
  zeroStateText: {
    ...h5,
    fontWeight: '300',
    textAlign: 'center',
    color: Colors.darkgrey,
  },

  borderWrap:{
    alignItems: 'center',
    flexDirection: 'row',
    zIndex:1,
    width:'100%'
  },
  iconPadding: {
    padding: 3,
  },
  searchInputContainerWithCollection: {
    height: 36,
    width: '83%',
    marginRight:0,
    flexDirection: 'row',
    zIndex: 10,
  },
  searchInputContainer: {
    height: 36,
    marginTop:2,
    width: '95%',
    marginRight:0,
    flexDirection: 'row',
    zIndex: 10,
  },
  collectionIconWrapper:{
    flexDirection: 'row',
    alignItems: 'center',

    zIndex:1,
    height: 40,
    paddingLeft:15,
    paddingTop: 8,
    left:0,
    width:'17%'
  },
  negZIndex:{
      zIndex:-1
  },
  textRow:{
    flexDirection:'row',
    paddingTop: 5,
    marginBottom:-4,
    zIndex:-1,
    paddingBottom:2,
  },
  formHeader: {
    fontSize: 14,
    paddingLeft:10,
    paddingRight:25,
  },

});
