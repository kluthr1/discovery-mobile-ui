import React from 'react';
import {
  StyleSheet, View,
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
  resourceType, label, isActive, selectResourceTypeAction,
}) => (
  <TouchableOpacity
    style={[styles.button, isActive ? styles.selected : null]}
    onPress={() => selectResourceTypeAction(resourceType)}
  >
    <BaseText style={[textStyles.button, isActive ? textStyles.selected : null]}>{label}</BaseText>
  </TouchableOpacity>
);

CategoryButton.propTypes = {
  resourceType: string.isRequired,
  label: string.isRequired,
  isActive: bool.isRequired,
  selectResourceTypeAction: func.isRequired,
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
          .map(({ type, label }) => (
            <CategoryButton
              key={type}
              resourceType={type}
              label={label}
              isActive={selectedResourceType === type}
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
    backgroundColor: 'white',
    borderColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
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
});
