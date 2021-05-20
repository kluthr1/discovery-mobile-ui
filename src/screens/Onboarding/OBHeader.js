import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';

import { number } from 'prop-types';
import Colors from '../../constants/Colors';

const OBHeader = ({
  totalProgressPositions, progressPosition
}) => {
  const filledMarkers = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < progressPosition; i++) {
    filledMarkers.push(<View key={i} style={styles.filledMarkers} />);
  }
  const emptyMakers = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < totalProgressPositions - progressPosition; i++) {
    emptyMakers.push(<View key={i} style={styles.emptyMarkers} />);
  }

  return (
    <View style={styles.root}>
      {progressPosition && (
        <View style={styles.progressContainer}>
          {filledMarkers}
          {emptyMakers}
        </View>
      )}
    </View>
  );
};

OBHeader.propTypes = {
  progressPosition: number,
  totalProgressPositions: number.isRequired,
};

OBHeader.defaultProps = {
  progressPosition: null,
}

export default OBHeader;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    marginBottom: 20,
    height: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    height: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    height: 75,
    width: 75,
    backgroundColor: Colors.mediumgrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  tempLogoText: {
    color: Colors.lightgrey,
  },
  filledMarkers: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightgrey2,
    backgroundColor: Colors.primary,
  },
  emptyMarkers: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightgrey2,
  },
  logo: {
    height: 50,
    width: 50,
    marginRight: 8,
  },
});