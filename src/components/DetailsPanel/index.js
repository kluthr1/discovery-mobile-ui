import React from 'react';
import {
  StyleSheet, View, ActionSheetIOS,
} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {
  Header, Right, Title, Left,
} from 'native-base';
import { Entypo, SimpleLineIcons } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies
import { arrayOf, shape, string } from 'prop-types';

import Colors from '../../constants/Colors';
import SubTypeAccordionsContainer from '../SubTypeAccordion/SubTypeAccordionsContainer';
import DateAccordionContainer from '../DateAccordion/DateAccordionContainer'
import SortingHeader from './SortingHeader';

const DetailsPanel = ({ navigation, collection }) => {
  const defaultSortingState = {
    "Record Type": {
      isPicked: true,
      isDescending: true
    },
    "Record Date": {
      isPicked: false,
      isDescending: true
    },
    "Time Saved": {
      isPicked: false,
      isDescending: true
    },
  }
  const [sortingState, setSortingState] = useState(defaultSortingState)

const DetailsPanel = ({ navigation, collection }) => {
  const handlePressSortIcon = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Sort Records By Category', 'Sort Records By Date Saved'],
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          // Sort Records By Category;
        } else if (buttonIndex === 2) {
          // Sort Records By Date Saved;
        }
      },
    );
  };

  const handlePressNoteIcon = () => {
    navigation.navigate('CollectionNotes');
  };

  const formattedResources = sortingState["Time Saved"].isPicked
    ? (
      <DateAccordionContainer />
    ) : (
      <SubTypeAccordionsContainer fromDetailsPanel />
    );
  return (
    <View>
      <Header style={styles.header}>
        <Left />
        <View>
          <Title>{collection?.label}</Title>
        </View>
        <Right>
          <TouchableOpacity style={styles.noteIcon} onPress={handlePressNoteIcon}>
            <SimpleLineIcons name="note" size={20} color={Colors.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePressSortIcon}>
            <Entypo name="dots-three-vertical" size={20} color={Colors.headerIcon} />
          </TouchableOpacity>
        </Right>
      </Header>
      <SortingHeader sortingState={sortingState} setSortingState={setSortingState}/>
      <ScrollView>
        {formattedResources}
      </ScrollView>
    </View>
  );
};

DetailsPanel.propTypes = {
  navigation: shape({}).isRequired,
  collection: shape({}).isRequired,
};

export default DetailsPanel;

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 0,
  },
  noteIcon: {
    marginRight: 15,
  },
});
