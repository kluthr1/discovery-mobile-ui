import React from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {
  arrayOf, func, shape, string, bool,
} from 'prop-types';
import { connect } from 'react-redux';

import Colors from '../../constants/Colors';
import { selectResourceType } from '../../redux/action-creators';
import { orderedResourceTypeFiltersSelector, activeCollectionResourceTypeSelector } from '../../redux/selectors';
import BaseText from '../Generic/BaseText';

const CategoryButton = ({
  resourceType, label, isActive, selectResourceTypeAction, hasCollectionItems, hasHighlightedItems,
}) => (
  <TouchableOpacity
    style={[styles.button, isActive ? styles.selected : null]}
    onPress={() => selectResourceTypeAction(resourceType)}
  >
    {hasCollectionItems && <Text style={textStyles.hasCollection}>⬤</Text>}
    {hasHighlightedItems && <Text style={textStyles.hasHighlighted}>⬤</Text>}
    <BaseText style={[textStyles.button, isActive ? textStyles.selected : null]}>{label}</BaseText>
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
  allTypeFilters,
  selectResourceTypeAction,
  selectedResourceType,
}) => (
  <View>
    <ScrollView
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
    </ScrollView>
  </View>
);

ResourceTypePicker.propTypes = {
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
    backgroundColor: Colors.lightgrey2,
    borderColor: 'gray',
    flexDirection: 'row',
    paddingHorizontal: 5,
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
  },
});

const textStyles = StyleSheet.create({
  button: {
    color: 'black',
  },
  selected: {
    fontWeight: '700',
  },
  hasCollection: {
    fontSize: 12,
    paddingRight: 4,
    color: Colors.collectionIcon,
  },
  hasHighlighted: {
    fontSize: 12,
    paddingRight: 4,
    color: Colors.hasFocused,
  },
});
