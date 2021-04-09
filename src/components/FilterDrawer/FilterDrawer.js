import React, {
  useRef, cloneElement, isValidElement, Children,
} from 'react';
import {
  bool, func, node, shape, string,
} from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Platform,
} from 'react-native';
import { DrawerLayout } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

import { PLURAL_RESOURCE_TYPES } from '../../resources/resourceTypes';
import Colors from '../../constants/Colors';
import { toggleResourceTypeFilter } from '../../redux/action-creators';
import { filteredResourceTypesSelector, activeCollectionResourceTypeFiltersSelector } from '../../redux/selectors';

const ResourceTypeFilter = ({ resourceType, filterOpen, toggleResourceTypeFilterAction }) => {
  const label = PLURAL_RESOURCE_TYPES[resourceType];
  let thumbColor;
  if (filterOpen) {
    thumbColor = Platform.OS === 'ios' ? 'white' : Colors.primary;
  } else {
    thumbColor = Platform.OS === 'ios' ? 'white' : Colors.lightgrey;
  }

  return (
    <View style={styles.categoryRow}>
      <Text>{label}</Text>
      <Switch
        trackColor={{
          false: Colors.mediumgrey,
          true: Platform.OS === 'ios' ? Colors.primary : Colors.primaryLight,
        }}
        thumbColor={thumbColor}
        onValueChange={() => toggleResourceTypeFilterAction(resourceType)}
        value={filterOpen}
      />
    </View>
  );
};

ResourceTypeFilter.propTypes = {
  resourceType: string.isRequired,
  filterOpen: bool.isRequired,
  toggleResourceTypeFilterAction: func.isRequired,
};

const FilterDrawer = ({
  toggleResourceTypeFilterAction,
  children,
  resourceTypeFilters,
}) => {
  const renderDrawer = () => (
    <View>
      <Text style={styles.drawerTitle}>Resource Type Filters</Text>
      {Object.entries(resourceTypeFilters).map(([resourceType, value]) => (
        <ResourceTypeFilter
          key={resourceType}
          resourceType={resourceType}
          filterOpen={value}
          toggleResourceTypeFilterAction={toggleResourceTypeFilterAction}
        />
      ))}
    </View>
  );

  const drawerRef = useRef(null);
  const handleOpenDrawer = () => {
    drawerRef.current.openDrawer();
  };

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { handleOpenDrawer });
    }
    return child;
  });

  return (
    <DrawerLayout
      ref={drawerRef}
      drawerWidth={wp('60%')}
      keyboardDismissMode="on-drag"
      drawerPosition={DrawerLayout.positions.Left}
      drawerType="front"
      drawerBackgroundColor="white"
      renderNavigationView={renderDrawer}
      edgeWidth={-wp('100%')}
    >
      <View style={styles.childrenContainer}>
        {childrenWithProps}
      </View>
    </DrawerLayout>
  );
};

FilterDrawer.propTypes = {
  resourceTypeFilters: shape({}).isRequired,
  toggleResourceTypeFilterAction: func.isRequired,
  children: node.isRequired,
};

const mapStateToProps = (state) => ({
  resourceTypeFilters: activeCollectionResourceTypeFiltersSelector(state),
});

const mapDispatchToProps = {
  toggleResourceTypeFilterAction: toggleResourceTypeFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterDrawer);

const styles = StyleSheet.create({
  drawerTitle: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center',
  },
  childrenContainer: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  noFiltersText: {
    color: Colors.darkgrey,
    fontStyle: 'italic',
    width: '100%',
    textAlign: 'center',
  },
});
