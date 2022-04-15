import React, {useEffect} from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import {
  arrayOf, func, shape, string, bool,
} from 'prop-types';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import { Entypo, Feather, MaterialCommunityIcons } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies

import Colors from '../../constants/Colors';
import { selectResourceType } from '../../redux/action-creators';
import { orderedResourceTypeFiltersSelector, activeCollectionResourceTypeSelector } from '../../redux/selectors';

const CategoryButton = ({
  resourceType, label, isActive, selectResourceTypeAction, hasCollectionItems, hasHighlightedItems,
}) => (
  <TouchableOpacity
    style={[styles.button, isActive ? styles.selected : null]}
    onPress={() => selectResourceTypeAction(resourceType)}
  >
    {hasHighlightedItems && <Text style={textStyles.hasHighlighted}>●</Text>}
    {hasCollectionItems && <Text style={textStyles.hasCollection}>■</Text>}
    <Text style={[textStyles.button, isActive ? textStyles.selected : null]}>{label}</Text>
  </TouchableOpacity>
);

CategoryButton.propTypes = {
  resourceType: string.isRequired,
  label: string.isRequired,
  isActive: bool.isRequired,
  selectResourceTypeAction: func.isRequired,
  hasCollectionItems: bool.isRequired,
  hasHighlightedItems: bool.isRequired,
};

CategoryButton.defaultProps = {
};

const ResourceTypePicker = ({
  handleOpenDrawer,
  noRecords,
  allTypeFilters,
  selectResourceTypeAction,
  selectedResourceType,
}) => {
  useEffect(() => {
    var firstOption = "";
    var updateSelection = false;
    for (var i in allTypeFilters){
      if (firstOption == "" && allTypeFilters[i]["hasItemsInDateRange"]){
        firstOption = allTypeFilters[i]["type"];
      }
      if(allTypeFilters[i]["type"] == selectedResourceType){
        if (!allTypeFilters[i]["hasItemsInDateRange"]){
          updateSelection = true;
        }
      }
    }
    if (updateSelection && firstOption != ""){
      selectResourceTypeAction(firstOption)
    }
  }, [allTypeFilters, selectedResourceType]);


  return (
  <View style = {styles.resourcePickerContainer}>

    <TouchableOpacity
      style={styles.drawerIcon}
      onPress={handleOpenDrawer}
    >
      <MaterialCommunityIcons
        name="filter-outline"
        size={30}
        color={"white"}
      />
    </TouchableOpacity>
    {noRecords &&
      <View style={styles.zeroStateContainer}>
        <Text style={styles.zeroStateText}>
          no Records found
        </Text>
      </View>

    }
    <View>

    {!noRecords && <ScrollView
      style={styles.root}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}
    >
      {
        allTypeFilters
          .filter(({ typeIsEnabled, hasItemsInDateRange }) => typeIsEnabled && hasItemsInDateRange)
          .map(({
            type, label, hasCollectionItems, hasHighlightedItems,
          }) => (
            <CategoryButton
              key={type}
              resourceType={type}
              label={label}
              isActive={selectedResourceType === type}
              hasCollectionItems={hasCollectionItems}
              hasHighlightedItems={hasHighlightedItems}
              selectResourceTypeAction={selectResourceTypeAction}
            />
          ))
      }
    </ScrollView>}

  </View>
  </View>

)};

ResourceTypePicker.propTypes = {
  handleOpenDrawer: func,

  allTypeFilters: arrayOf(shape({
    type: string.isRequired,
    typeIsEnabled: bool.isRequired,
    label: string.isRequired,
  })).isRequired,
  selectedResourceType: string,
  selectResourceTypeAction: func.isRequired,
};

ResourceTypePicker.defaultProps = {
  selectedResourceType: null,
  handleOpenDrawer: null,

};

const mapStateToProps = (state) => ({
  allTypeFilters: orderedResourceTypeFiltersSelector(state),
  selectedResourceType: activeCollectionResourceTypeSelector(state),
});

const mapDispatchToProps = {
  selectResourceTypeAction: selectResourceType,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceTypePicker);

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.logoBlue,
    borderColor: 'gray',
    flexDirection: 'row',
    paddingHorizontal: 5,
    zIndex:-1
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 16,
    borderWidth: 2,
  },
  selected: {
    borderColor: Colors.darkgrey,
  },
  contentContainerStyle: {
    flexDirection: 'row',
    height: 45,
    alignItems: 'center',
    zIndex:-1

  },
  resourcePickerContainer:{
    zIndex:-1,
    flexDirection: "row",
    backgroundColor:Colors.primary,

  },
  resourcePickerWidth:{
    width:"90%",
  },
  drawerIcon: {
    paddingLeft: 5,
    marginRight:0,
    paddingTop:7,
  },
  zeroStateContainer: {
    flex: 1,
    width:"100%",
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex:-1,
    height: 45,
  },
  zeroStateText: {
    paddingTop:12,
    textAlign: 'center',
    color: 'white',

  },

});

const textStyles = StyleSheet.create({
  button: {
    color: 'black',
  },
  selected: {
    fontWeight: '700',
  },
  hasHighlighted: {
    fontSize: 16,
    paddingRight: 4,
    color: Colors.hasFocused,
  },
  hasCollection: {
    fontSize: 16,
    paddingRight: 4,
    color: Colors.collectionIcon,
    zIndex:-1

  },

});
