import React, { useState, useEffect } from 'react';
import { arrayOf, shape, func} from 'prop-types';
import {
  StyleSheet, View, TouchableOpacity, ScrollView, Text, TextInput, Fragment
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

import { connect, useSelector } from 'react-redux';
import {
  Header, Right, Title, Left,
} from 'native-base';
import { Entypo, Feather } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies

import Timeline from '../Timeline';

import ResourceTypePicker from '../ResourceTypePicker';
import SubTypeAccordionsContainer from '../SubTypeAccordionsContainer';
import {
  activeCollectionSelector, selectedRecordsGroupedByTypeSelector,
  savedRecordsSelector, timelineIntervalsSelector,
  allValidRecordsSortedByDateSelector,
  activeSearchFilterSelector
} from '../../redux/selectors';
import { updateSearchTerm } from '../../redux/action-creators';
import CatalogModal from '../Modals/CatalogModal';
import FilterDrawer from '../FilterDrawer';
import Colors from '../../constants/Colors';
import HeaderCountIcon from '../Icons/HeaderCountIcon';
import TextStyles from '../../constants/TextStyles';
import CollectionIcon from '../Icons/CollectionIcon';

const CatalogScreenHeader = ({ collection, navigation }) => {
  const savedRecords = useSelector(savedRecordsSelector).length;
  return (
    <Header style={styles.header}>
      <Left>
        {/* }<TouchableOpacity onPress={() => navigation.goBack()}> */}
        <TouchableOpacity onPress={() => navigation.navigate('CollectionsList')}>
          <Entypo name="chevron-thin-left" size={20} color={Colors.headerIcon} />
        </TouchableOpacity>
      </Left>
      <View style={styles.headerTitleContainer}>
        <HeaderCountIcon count={savedRecords} outline />
        <Title style={styles.collectionLabel}>{collection?.label}</Title>
      </View>
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

const Catalog = ({
  collection,
  selectedRecordsGroupedByType,
  navigation,
  timelineIntervals,
  allRecords,
  searchSelector,
  searchTermFilter,

}) => {
  const noRecords = timelineIntervals.recordCount === 0;
  const [selectedItem, setSelectedItem] = useState(null)
  const [autoFillRecords, setAutoFillRecords] = useState([])
  const [resourceIds, setResourceIds] = useState([])
  const [searchRecordText, setSearchRecordText] = useState("")
  const [selectedItem2, setSelectedItem2] = useState(null)


  useEffect(() => {
    searchTermFilter(searchRecordText);

    var newAutoFill = []
    var storeResourceIds = []
    for (var i in allRecords){
      var string = allRecords[i]["subType"]
      var to_add = true
      var words = searchRecordText.split(' ')
      for (var j in words){
        if(!string.toLowerCase().includes(words[j].toLowerCase())){
          to_add = false
        }

      }
      if (string.toLowerCase().includes(searchRecordText.toLowerCase())){
        newAutoFill.push(allRecords[i]["subType"])
        storeResourceIds.push(allRecords[i].id)
      }
      //subType.toLowerCase().includes(filter["searchTerms"][x].toLowerCase()
    }
    var unique = newAutoFill.filter((v, i, a) => a.indexOf(v) === i);
    newAutoFill = []

    for (var i in unique){
      newAutoFill.push({id: i, title: unique[i]})

    }
    setAutoFillRecords(newAutoFill)
    setResourceIds(storeResourceIds)

  }, [allRecords, searchRecordText]);


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
            <View  style = {styles.borderWrap}>

              <View style={styles.searchInputContainer}>
              <View style={styles.iconPadding}>
                <Feather name="search" size={20} />
              </View>
                <TextInput
                  style = {styles.textInput}
                  onChangeText={setSearchRecordText}
                  placeholder={"search records"}
                  value={searchRecordText}
                  multiline={false}
                  autoFocus
                />

              </View>
              <CollectionIcon
                showCount={true}
                collectionId={collection['id']}
                resourceIds={resourceIds}
              />
            </View>
          </View>
          <Timeline noRecords={noRecords} />
          {noRecords && (
          <View style={styles.zeroStateContainer}>
            <Text style={styles.zeroStateText}>
              No Records available based on the filters or the time interval.
            </Text>
          </View>
          )}
          {!noRecords && (
          <>
            <ResourceTypePicker />
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

};

const mapStateToProps = (state) => ({
  collection: activeCollectionSelector(state),
  selectedRecordsGroupedByType: selectedRecordsGroupedByTypeSelector(state),
  timelineIntervals: timelineIntervalsSelector(state),
  allRecords: allValidRecordsSortedByDateSelector(state),
  searchSelector: activeSearchFilterSelector(state)
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
    flex: 1,
    paddingTop: 28,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  zeroStateText: {
    ...h5,
    fontWeight: '300',
    textAlign: 'center',
    color: Colors.darkgrey,
  },
  textInput: {
    width:'100%',
    height:'100%',
    padding: 8,
    zIndex:100,
  },
  borderWrap:{
    alignItems: 'center',
    marginVertical: 5,
    flexDirection: 'row',
  },
  iconPadding: {
    padding: 3,
  },
  searchInputContainer: {
    height: 36,
    width: '85%',
    borderRadius: 10,
    borderWidth: 0.5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    flexDirection: 'row',
    marginLeft: 5,
    marginRight:3,

  },
  suggestedListStyles:{
    position: 'absolute',
    zIndex:10,
    borderRadius: 10,
    borderWidth: 0.5,
    width: '85%',
    marginLeft:5,
  },
  searchDropDownWrapper:{
    position:'relative'
  }
});
