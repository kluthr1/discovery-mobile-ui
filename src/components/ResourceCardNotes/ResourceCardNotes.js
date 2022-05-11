import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity , Text} from 'react-native';
import { connect } from 'react-redux';

import {
  bool, shape, string, arrayOf, func,
} from 'prop-types';
import { Ionicons, Feather } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies

import NotesList from '../Notes/NotesList';
import { recordNotesSelector } from '../../redux/selectors';
import ResourceCardNoteActions from './ResourceCardNoteActions';
import Colors from '../../constants/Colors';

const ResourceCardNotes = ({
  fromNotesScreen,
  resourceId,
  recordNotes,
  handleEditNote,
  editNoteId,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const hasNotes = recordNotes.length > 0;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <View>
      <TouchableOpacity style={styles.collectionRow}>
        <View style={styles.collectionRowCountIconsContainer}>
        
        </View>
        <View style={styles.iconContainer}>
        </View>
      </TouchableOpacity>
      {!fromNotesScreen
        && (
          <View style={styles.noteActionsContainer}>
            <ResourceCardNoteActions
              hasNotes={hasNotes}
              showNotes={showNotes}
              setShowNotes={setShowNotes}
              resourceId={resourceId}
            />
          </View>
        )}
      <NotesList
        resourceId={resourceId}
        notes={recordNotes}
        showNotes={showNotes}
        fromNotesScreen={fromNotesScreen}
        handleEditNote={handleEditNote}
        editNoteId={editNoteId}
      />
    </View>
  );
};

ResourceCardNotes.propTypes = {
  fromNotesScreen: bool,
  resourceId: string.isRequired,
  recordNotes: arrayOf(shape({}).isRequired).isRequired,
  handleEditNote: func,
  editNoteId: string,
};

ResourceCardNotes.defaultProps = {
  fromNotesScreen: false,
  handleEditNote: undefined,
  editNoteId: null,
};

const mapStateToProps = (state, ownProps) => ({
  recordNotes: recordNotesSelector(state, ownProps),
});

export default connect(mapStateToProps, null)(ResourceCardNotes);

const styles = StyleSheet.create({
  noteActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
