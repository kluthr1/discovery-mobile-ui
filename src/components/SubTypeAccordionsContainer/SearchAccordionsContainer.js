import React from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import { shape, arrayOf, bool } from 'prop-types';

import SearchAccordion from './SearchAccordion';
import { PLURAL_RESOURCE_TYPES } from '../../constants/resource-types';

const SearchAccordionsContainer = ({ data, fromDetailsPanel, fromDateAccordion }) => {


  return(
  <View>
    { data.map(({ type, subTypes }, index) => {
      const firstGroupStyle = index === 0 ? styles.firstGroupContainer : {};
      return (
        <View key={type} style={[styles.groupContainer, firstGroupStyle]}>
          {fromDetailsPanel
                && (
                <View style={[
                  styles.typeTextContainer,
                  fromDateAccordion ? styles.addMarginLeft : null,
                ]}
                >
                  <View style={styles.typeTextPill}>
                    <Text style={styles.typeText}>
                      {PLURAL_RESOURCE_TYPES[type]}
                    </Text>
                  </View>
                </View>
                )}
          <View style={styles.root}>
            <View style={styles.container}>
              {subTypes.map(({ subType, recordIds }) => (
                <SearchAccordion
                  key={subType}
                  headerLabel={subType}
                  resourceIds={recordIds}
                  headerCount={recordIds.length}
                  fromDetailsPanel={fromDetailsPanel}
                  fromDateAccordion={fromDateAccordion}
                />
              ))}

            </View>
          </View>
        </View>
      );
    })}
  </View>
)};

SearchAccordionsContainer.propTypes = {
  data: arrayOf(shape({})).isRequired,
  fromDetailsPanel: bool,
  fromDateAccordion: bool,
};

SearchAccordionsContainer.defaultProps = {
  fromDetailsPanel: false,
  fromDateAccordion: false,
};

export default SearchAccordionsContainer;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
  },
  groupContainer: {
    marginTop: 20,
  },
  firstGroupContainer: {
    marginTop: 0,
  },
  typeTextContainer: {
    marginLeft: 5,
    alignItems: 'flex-start',
    paddingLeft:1,
  },
  typeText: {
    fontWeight: '700',
  },
  typeTextPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
  },
  addMarginLeft: {
    marginLeft: 30,
  },
});
