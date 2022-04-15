import {
  arrayOf, bool, func, string, shape,
} from 'prop-types';
import React, {useState} from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies

import Colors from '../../constants/Colors';
import { activeCollectionResourceIdsSelector, activeCollectionShowCollectionOnlySelector } from '../../redux/selectors';
import { addResourceToCollection, removeResourceFromCollection } from '../../redux/action-creators';

const CollectionIconWithUndo = ({
  collectionId,
  resourceIds,
  previousResourceIds,
  showCount,
  addResourceToCollectionAction,
  removeResourceFromCollectionAction,
  collectionResourceIds,
  showCollectionOnly,
}) => {
  const resourceCount = resourceIds.reduce((acc, id) => {
    const inCollection = collectionResourceIds[id];
    return (inCollection) ? acc + 1 : acc;
  }, 0);

  const iconCount = (showCount && resourceCount) ? resourceCount : null;
  const [numClicks, setNumClicks] = useState(0);

  const handlePress = () => {
    setNumClicks((numClicks + 1)%3)



    if(previousResourceIds.length === 0 || previousResourceIds.length === resourceIds.length){

      (resourceCount === resourceIds.length
      ? removeResourceFromCollectionAction(collectionId, resourceIds)
      : addResourceToCollectionAction(collectionId, resourceIds))
    }else{
      if (resourceCount === 0){
        addResourceToCollectionAction(collectionId, previousResourceIds)
      }
      else if(resourceCount === resourceIds.length){
        removeResourceFromCollectionAction(collectionId, resourceIds)
      }else{
        addResourceToCollectionAction(collectionId, resourceIds)
      }
    }
  };

  // eslint-disable-next-line no-nested-ternary
  const iconColor = resourceCount
    ? showCollectionOnly
      ? Colors.collectionIconDisabled
      : Colors.collectionIcon
    : Colors.lightgrey;

  const iconType = resourceCount ? 'bookmark' : 'bookmark-outline';

  return (
    <>
      {showCount && (
        <View style={styles.countContainer}>
          <Text style={[styles.text, showCollectionOnly ? styles.textDisabled : {}]}>
            {iconCount}
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={handlePress}
        disabled={showCollectionOnly}
      >
        <Ionicons name={iconType} size={28} color={iconColor} />
      </TouchableOpacity>
    </>
  );
};

CollectionIconWithUndo.propTypes = {
  collectionId: string.isRequired,
  resourceIds: arrayOf(string.isRequired).isRequired,
  showCount: bool.isRequired,
  addResourceToCollectionAction: func.isRequired,
  removeResourceFromCollectionAction: func.isRequired,
  collectionResourceIds: shape({}).isRequired,
  showCollectionOnly: bool.isRequired,
};

const mapStateToProps = (state) => ({
  collectionResourceIds: activeCollectionResourceIdsSelector(state),
  showCollectionOnly: activeCollectionShowCollectionOnlySelector(state),
});

const mapDispatchToProps = {
  addResourceToCollectionAction: addResourceToCollection,
  removeResourceFromCollectionAction: removeResourceFromCollection,
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionIconWithUndo);

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontWeight: '700',
  },
  textDisabled: {
    color: Colors.darkgrey2,
  },
  base: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.collectionUnselected,
    marginLeft: 10,
  },
  hasResource: {
    borderColor: Colors.collectionIcon,
    backgroundColor: Colors.collectionIcon,
    borderWidth: 2,
  },
  hasResourceDisabled: {
    borderColor: Colors.collectionIconDisabled,
    backgroundColor: Colors.collectionIconDisabled,
    borderWidth: 2,
  },
  countContainer: {
    minWidth: 20,
    alignItems: 'flex-end',
  },
});
