import React, { useState } from 'react';
import {
  StyleSheet, TouchableOpacity, View, Text,
} from 'react-native';
import {
  func, number, shape, string, bool,
} from 'prop-types';
import { connect } from 'react-redux';
import { Ionicons, Feather } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies

import Colors from '../../constants/Colors';
import CollectionRowActionIcon from '../Icons/CollectionRowActionIcon';
import { selectCollection, isAddingNewCollection } from '../../redux/action-creators';
import {
  collectionByIdSelector,
} from '../../redux/selectors';
import { formatDateShort } from '../../resources/fhirReader';
import PreBuiltDescriptionText from './PreBuiltDescriptionText';

const CountInfo = ({ count, label, color }) => (
  <View style={styles.countIconContainer}>
    <View style={[
      styles.countIcon,
      color ? { backgroundColor: color } : Colors.lightgrey2,
    ]}
    >
      <Text>{count}</Text>
    </View>
    {label && <Text style={styles.countIconText}>{label}</Text>}
  </View>
);

CountInfo.propTypes = {
  count: number.isRequired,
  label: string,
  color: string,
};

CountInfo.defaultProps = {
  label: null,
  color: null,
};

const DateInfo = ({ date, label, color }) => (
  <View style={styles.dateRow}>
    <Text style={color ? { color } : null}>
      {date}
    </Text>
    {label && (
      <Text style={styles.dateText}>
        {label}
      </Text>
    )}
  </View>
);

DateInfo.propTypes = {
  date: string.isRequired,
  label: string,
  color: string,
};

DateInfo.defaultProps = {
  label: null,
  color: null,
};

const CollectionRow = ({
  collection,
  collectionId,
  label,
  navigation,
  selectCollectionAction,
  isAddingNewCollectionAction,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const handlePress = () => {
    selectCollectionAction(collectionId);
    isAddingNewCollectionAction(false);

    navigation.navigate('Catalog');
  };
  const createdDate = formatDateShort(collection.created);
  const modifiedDate = formatDateShort(collection.lastUpdated);
  const collectionNotesCount = Object.keys(collection.notes).length;
  const collectionRecords = Object.values(collection.records);
  const recordNotesCount = collectionRecords.reduce((acc, { notes }) => (
    notes ? acc.concat(Object.keys(notes)) : acc), []).length;
  const savedRecordsCount = collectionRecords.filter((record) => record.saved === true).length;
  const showPurpose = (collection?.purpose.length) > 0;
  return (
    <View style={styles.collectionRowContainer}>
      <View style={styles.dateInfoRow}>
        <View style={styles.dateInfoMargin}>
          <DateInfo date={modifiedDate} />
        </View>
        <DateInfo date={createdDate} color={Colors.darkgrey} />
      </View>
      <TouchableOpacity style={styles.collectionRow} onPress={handlePress}>
        <View style={styles.collectionRowCountIconsContainer}>
          <CountInfo count={savedRecordsCount} color={Colors.collectionYellow} />
          <CountInfo count={collectionNotesCount + recordNotesCount} color={Colors.mediumgrey} />
          <Text style={styles.labelText}>{label}</Text>
        </View>
        <View style={styles.iconContainer}>

          {collection?.current
            && (
            <View style={styles.iconPadding}>
              <Feather name="watch" size={20} color={Colors.currentCollectionColor} />
            </View>
            )}
          {collection?.urgent
            && (
            <View style={styles.iconPadding}>
              <Feather name="alert-triangle" size={20} color={Colors.destructive} />
            </View>
            )}

          <TouchableOpacity style={styles.infoIcon} onPress={() => setShowDetails(!showDetails)}>
            <Ionicons name="information-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          <CollectionRowActionIcon collectionId={collectionId} collectionLabel={label} />
        </View>
      </TouchableOpacity>
      {showDetails && (
        <View style={styles.detailsContainer}>
          {collection.preBuilt && (
            <View style={styles.descriptionContainer}>
              <Text>
                <PreBuiltDescriptionText collectionId={collectionId} />
              </Text>
            </View>
          )}
          <View>

            {showPurpose
            && (
            <View>
              <Text style={styles.purposeText}>
                {collection?.purpose}
              </Text>
            </View>
            )}

            {collection?.current
            && (
            <View style={styles.currentTextField}>

              <Feather name="watch" size={18} color={Colors.currentCollectionColor} />

              <Text style={styles.switchText}>Current Collection</Text>
            </View>
            )}
            {collection?.urgent
            && (
            <View style={styles.currentTextField}>
              <Feather name="alert-triangle" size={18} color={Colors.destructive} />

              <Text variant="title" style={styles.switchText}>Urgent Collection</Text>
            </View>
            )}
            <View style={styles.badgeRow}>
              {Object.entries(collection.tags).map((item, index) => (
                <TouchableOpacity style={styles.badgeStyle}>
                  <Text>{collection.tags[index]}</Text>

                </TouchableOpacity>
              ))}
            </View>

            <CountInfo count={savedRecordsCount} label="Records In Collection" color={Colors.collectionYellow} />
            <CountInfo count={collectionNotesCount} label="Collection Notes" color={Colors.mediumgrey} />
            <CountInfo count={recordNotesCount} label="Record Notes" color={Colors.mediumgrey} />
            <View style={styles.dateInfoContainer}>

              <DateInfo date={modifiedDate} label="Last Modified" />

              <View style={styles.dateInfoContainer}>
                <DateInfo date={createdDate} label="Created" color={Colors.darkgrey2} />

              </View>
            </View>

          </View>
        </View>
      )}
    </View>
  );
};

CollectionRow.propTypes = {
  collection: shape({}).isRequired,
  collectionId: string.isRequired,
  label: string.isRequired,
  navigation: shape({}).isRequired,
  selectCollectionAction: func.isRequired,
  isAddingNewCollectionAction: bool.isRequired,

};

CollectionRow.defaultProps = {
};

const mapStateToProps = (state, ownProps) => ({
  collection: collectionByIdSelector(state, ownProps),

});

const mapDispatchToProps = {
  selectCollectionAction: selectCollection,
  isAddingNewCollectionAction: isAddingNewCollection,

};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionRow);

const styles = StyleSheet.create({
  collectionRowContainer: {
    width: '90%',
    paddingTop: 12,
  },
  collectionRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 8,
  },
  countIcon: {
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  countIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginRight: 6,
  },
  countIconText: {
    marginLeft: 8,
  },
  detailsContainer: {
    borderColor: Colors.collectionYellow,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    marginLeft: 8,
  },
  dateInfoContainer: {
    marginTop: 4,
  },
  dateInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInfoMargin: {
    marginRight: 24,
  },
  labelText: {
    fontSize: 16,
  },
  collectionRowCountIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  currentTextField: {
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 5,

    paddingLeft: 3,
  },
  switchText: {
    paddingLeft: 12,
  },
  purposeText: {
    paddingTop: 2,
    paddingLeft: 7,
    paddingBottom: 5,
    paddingRight: 5,
  },
  iconPadding: {
    padding: 3,
  },
  badgeStyle: {
    borderRadius: 10,
    backgroundColor: Colors.sortingHeaderBackground,
    paddingHorizontal: 10,
    marginRight: 10,
    paddingVertical: 5,
    marginVertical: 2,

  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 5,
    flexWrap: 'wrap',

  },
});
