import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import { Accordion } from 'native-base';
import { connect } from 'react-redux';
import {
  arrayOf, bool, number, string,
} from 'prop-types';
import { Ionicons } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies

import {
  activeCollectionIdSelector,
} from '../../redux/selectors';
import Colors from '../../constants/Colors';
import ResourceCard from '../ResourceCard/ResourceCard';
import BaseText from './BaseText';
import CountIcon from '../Icons/CountIcon';
import FocusedIcon from '../Icons/FocusedIcon';
import MarkedIcon from '../Icons/MarkedIcon';
import CollectionIcon from '../Icons/CollectionIcon';

const AccordionHeader = ({ data, expanded }) => {
  const chevronIcon = expanded
    ? <Ionicons name="chevron-up" size={16} color={Colors.accordionChevronIcon} />
    : <Ionicons name="chevron-down" size={16} color={Colors.accordionChevronIcon} />;

  console.info('AccordionHeader: ', data, expanded);

  const {
    title, content, fromDetailsPanel, headerCount, activeCollectionId,
  } = data;

  return (
    <View style={styles.header}>
      <View style={styles.headerTextContainer}>
        {chevronIcon}
        <CountIcon count={headerCount} />
        <BaseText style={styles.headerText}>
          {title}
        </BaseText>
      </View>
      <View style={styles.rightIconsContainer}>
        { !fromDetailsPanel
        && (
          <>
            <FocusedIcon
              subType={title}
              resourceIds={content}
              isAccordion
            />
            <MarkedIcon
              subType={title}
              resourceIds={content}
              subTypeCount={headerCount}
              isAccordion
            />
          </>
        )}
        <CollectionIcon
          collectionId={activeCollectionId}
          resourceIds={content}
          showCount
        />
      </View>
    </View>
  );
};

const SubTypeAccordion = ({
  headerCount,
  resourceIds,
  activeCollectionId,
  headerLabel,
  fromDetailsPanel,
}) => (
  <View style={styles.accordionContainer}>
    <Accordion
      style={styles.accordion}
      dataArray={[{
        title: headerLabel,
        content: resourceIds,
        fromDetailsPanel,
        headerCount,
        activeCollectionId,
      }]}
      expanded={[]}
      renderHeader={(data, expanded) => (
        <AccordionHeader
          expanded={expanded}
          data={data}
        />
      )}
      renderContent={(data) => data.content.map(
        (resourceId, cardIndex) => (
          <ResourceCard
            key={resourceId}
            index={cardIndex}
            resourceId={resourceId}
            collectionId={activeCollectionId}
            fromDetailsPanel={fromDetailsPanel}
          />
        ),
      )}
    />
  </View>
);

SubTypeAccordion.propTypes = {
  headerCount: number.isRequired,
  resourceIds: arrayOf(string.isRequired).isRequired,
  activeCollectionId: string.isRequired,
  headerLabel: string.isRequired,
  fromDetailsPanel: bool,
};

SubTypeAccordion.defaultProps = {
  fromDetailsPanel: false,
};

const mapStateToProps = (state) => ({
  activeCollectionId: activeCollectionIdSelector(state),
});

export default connect(mapStateToProps, null)(SubTypeAccordion);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 5,
    color: 'black',
    flex: 1,
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionContainer: {
    backgroundColor: Colors.resourceCardBorder,
  },
  accordion: {
    borderWidth: 0,
  },
});
