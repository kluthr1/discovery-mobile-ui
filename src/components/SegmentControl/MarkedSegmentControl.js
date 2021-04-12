import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bool, func, shape } from 'prop-types';

import BaseSegmentControl from '../Generic/BaseSegmentControl';
import BaseText from '../Generic/BaseText';
import { toggleShowMarkedOnly } from '../../redux/action-creators';
import { activeCollectionShowMarkedOnlySelector, filterTriggerDateRangeSelector, activeCollectionMarkedResourcesSelector } from '../../redux/selectors';
import { actionTypes } from '../../redux/action-types';

const allRecordsDescription = 'Displays all records.';
const highlightedRecordsDescription = 'Only displays highlighted records.';

const MarkedSegmentControl = ({
  showMarkedOnly,
  toggleShowMarkedOnlyAction,
  updateDateRangeFilter,
  filterTriggerDateRange,
  collectionMarkedResources,
}) => {
  const segControlIndex = showMarkedOnly ? 1 : 0;
  const description = segControlIndex === 0 ? allRecordsDescription : highlightedRecordsDescription;
  const handleChange = (selectedSegmentIndex) => {
    toggleShowMarkedOnlyAction(selectedSegmentIndex !== 0);
    updateDateRangeFilter(filterTriggerDateRange);
  };
  const markedResourcesIds = Object.keys(collectionMarkedResources.marked)
  const isEnabled = markedResourcesIds.length > 0

  // reset SegmentControl and TimelineRange when user
  // clears Marked Records while in Show Marked Only view
  useEffect(() => {
    if (showMarkedOnly && markedResourcesIds.length === 0) {
      toggleShowMarkedOnlyAction(false);
      updateDateRangeFilter(filterTriggerDateRange);
    }
  }, [segControlIndex, isEnabled]);

  return (
    <View style={styles.root}>
      <BaseSegmentControl
        values={['All Records', 'Highlighted Records']}
        selectedIndex={segControlIndex}
        onChange={handleChange}
        enabled={isEnabled}
      />
      <BaseText style={styles.descriptionText}>{description}</BaseText>
    </View>
  );
};

MarkedSegmentControl.propTypes = {
  showMarkedOnly: bool.isRequired,
  toggleShowMarkedOnlyAction: func.isRequired,
  filterTriggerDateRange: shape({}).isRequired,
  updateDateRangeFilter: func.isRequired,
  collectionMarkedResources: shape({}).isRequired
};

const mapStateToProps = (state) => ({
  showMarkedOnly: activeCollectionShowMarkedOnlySelector(state),
  filterTriggerDateRange: filterTriggerDateRangeSelector(state, ownProps),
  collectionMarkedResources: activeCollectionMarkedResourcesSelector(state)
});

const mapDispatchToProps = {
  toggleShowMarkedOnlyAction: toggleShowMarkedOnly,
  updateDateRangeFilter: ({ dateRangeStart, dateRangeEnd }) => ({
    type: actionTypes.UPDATE_DATE_RANGE_FILTER,
    payload: {
      dateRangeStart,
      dateRangeEnd,
    },
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(MarkedSegmentControl);

const styles = StyleSheet.create({
  root: {
    marginBottom: 30,
  },
  descriptionText: {
    marginTop: 10,
    width: '100%',
    textAlign: 'center',
  },
});
