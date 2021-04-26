import React from 'react';
import {
  StyleSheet, View, Text, SafeAreaView,
} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {
  Header, Right, Title, Left,
} from 'native-base';
import { SimpleLineIcons } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies
import { arrayOf, shape } from 'prop-types';
import { connect } from 'react-redux';

import Colors from '../../constants/Colors';
import SortingHeader from './SortingHeader';
import { SORT_DESC, sortFields } from '../../constants/sorting';
import DateAccordionsContainer from '../DateAccordionContainer/DateAccordionsContainer';
import SubTypeAccordionsContainer from '../SubTypeAccordion/SubTypeAccordionsContainer';
import { savedRecordsGroupedByTypeSelector } from '../../redux/selectors';

const DetailsPanel = ({ navigation, collection, savedRecords }) => {
  const { savedRecordsSortingState: sortingState } = collection;
  const { RECORD_TYPE, RECORD_DATE, TIME_SAVED } = sortFields;

  const handlePressNoteIcon = () => {
    navigation.navigate('CollectionNotes');
  };

  const displayAccordion = () => {
    switch (sortingState.activeSortField) {
      case RECORD_TYPE:
        return (
          <SubTypeAccordionsContainer
            data={savedRecords}
            isDescending={sortingState.sortDirections[RECORD_TYPE] === SORT_DESC}
            fromDetailsPanel
          />
        );
      case RECORD_DATE:
        return (
          <DateAccordionsContainer
            isDescending={sortingState.sortDirections[RECORD_DATE] === SORT_DESC}
            fromDetailsPanel
          />
        );
      case TIME_SAVED:
        return <Text>TimeSaved</Text>;
      default:
        console.warn('No activeSortField in DetailsPanel'); // eslint-disable-line no-console
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header style={styles.header}>
        <Left />
        <View>
          <Title>{collection?.label}</Title>
        </View>
        <Right>
          <TouchableOpacity onPress={handlePressNoteIcon}>
            <SimpleLineIcons name="note" size={20} color={Colors.headerIcon} />
          </TouchableOpacity>
        </Right>
      </Header>
      <SortingHeader
        sortingState={sortingState}
      />
      <ScrollView>
        {displayAccordion()}
      </ScrollView>
    </SafeAreaView>
  );
};

DetailsPanel.propTypes = {
  navigation: shape({}).isRequired,
  collection: shape({}).isRequired,
  savedRecords: arrayOf(shape({}).isRequired).isRequired,
};

const mapStateToProps = (state) => ({
  savedRecords: savedRecordsGroupedByTypeSelector(state),
});

export default connect(mapStateToProps, null)(DetailsPanel);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 0,
  },
});
