import React, {useState} from 'react';
import {
  StyleSheet, View, Dimensions, Text, TouchableOpacity,
} from 'react-native';
import {
  arrayOf, instanceOf, shape, string, number, bool,
} from 'prop-types';
import { connect } from 'react-redux';
import Svg, {
  Rect, G, Text as SvgText,
} from 'react-native-svg';

import { timelineIntervalsSelector, secondaryTimelineIntervalsSelector,
   activeCollectionResourceTypeSelector, orderedResourceTypeFiltersSelector } from '../../../redux/selectors';
import VarianceLegend from './VarianceLegend';
import GroupingLegend from './GroupingLegend';
import VerticalBound from './VerticalBound';
import HorizontalLabels from './HorizontalLabels';
import Variance from './Variance';
import Bar from './Bar';
import XAxis from './XAxis';
import MarkedIndicators from './MarkedIndicators';
import Colors from '../../../constants/Colors';
import * as config from './config';
import SetDateFilter from '../SetDateFilters';

const TimelineItems = ({
  availableWidth, countForMaxBarHeight, intervals, showVariance,
  showAll, showCollection, showType
}) => {
  if (!countForMaxBarHeight) {
    return null;
  }
  const tickUnits = config.BAR_HEIGHT / countForMaxBarHeight;
  return intervals
    .filter(({ items }) => !!items.length)
    .map(({
      key, position, zScore, items, markedItems, collectionItems, typeItems, typeCollectionItems
    }) => (

      <>
      <G
        key={key}
        x={position * availableWidth + config.BAR_WIDTH/2*0}
      >
        {false && (
        <Variance
          x={0}
          y={-4}
          zScore={zScore}
        />
        )}
        {!typeItems.length == 0 && showType &&<Bar
          x={0}
          width={config.BAR_WIDTH}
          height={Math.max(Math.min(typeItems.length, countForMaxBarHeight) * tickUnits, 4)}
          color={config.BAR_COLOR}
        />
      }
        {!typeCollectionItems.length == 0 && showCollection && showType &&(
          <Bar
            x={0}
            width={config.BAR_WIDTH}
            height={Math.max(Math.min(typeCollectionItems.length, countForMaxBarHeight) * tickUnits, 4)}
            color={Colors.collectionIcon}
          />
        )}

      </G>

      <G
        key={key.toString() + "SelectedResource"}
        x={position * availableWidth-config.BAR_WIDTH}
      >

        {showAll && <Bar
          x={0}
          width={config.BAR_WIDTH}
          height={Math.max(Math.min(items.length, countForMaxBarHeight) * tickUnits, 4)}
          color={Colors.lightgrey}
        />}
        {(!collectionItems.length || !showCollection || !showAll) ? null : (
          <Bar
            x={0}
            width={config.BAR_WIDTH}
            height={Math.max(Math.min(collectionItems.length, countForMaxBarHeight) * tickUnits, 4)}
            color={Colors.collectionIcon}
          />
        )}


        <MarkedIndicators
          markedItems={markedItems}
        />
      </G>
      </>

    ));
};

TimelineItems.propTypes = {
  availableWidth: number.isRequired,
  countForMaxBarHeight: number.isRequired,
  intervals: arrayOf(shape({})).isRequired,
  showVariance: bool.isRequired,
};

const TimelineChart = ({ timelineIntervals, selectedResourceType, allTypeFilters }) => {
  const {
    maxCount, maxCount1SD, maxCount2SD, recordCount, recordCount2SDplus,
    intervals, intervalLength,
    minDate, maxDate,
  } = timelineIntervals;
  const screenWidth = Dimensions.get('window').width;
  const availableWidth = screenWidth - (4 * config.CHART_MARGIN);
  // TODO: a full, multi-line description of applied filters?
  const noResultsMessage = recordCount ? '' : 'No loaded records pass your filters.';
  const showVariance = maxCount > config.VARIANCE_THRESHOLD;
  const countForMaxBarHeight = showVariance ? maxCount1SD : maxCount;
  const group_by = Math.round(intervalLength) == 1 ? " day)" : " days)";
  const typeLabel = allTypeFilters.filter(val => val.type == selectedResourceType)[0]["label"]
  const [showAll, setShowAll] = useState(true)
  const [showType, setShowType] = useState(true)
  const [showCollection, setShowCollection] = useState(true)

  return (
    <View
      style={[
        // StyleSheet.absoluteFill,
        styles.root,
      ]}
    >
    {/*<View style={styles.dateRangeContainer}>

    <SetDateFilter />
    </View>*/}

      <View style={styles.textWrapper}>
        <Text style={styles.headerText}>{"Records Over Time (grouped by " + Math.round(intervalLength) + group_by}</Text>
      </View>
      <View style={styles.buttonBar}>
        <TouchableOpacity style={styles.filterButton}
        onPress={() => setShowAll(!showAll)}>
          <View style = {showAll ? styles.showAllBox : styles.notSelectedBox}>
          </View>
          <Text style={styles.buttonText}>{"All"}</Text>

        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}
        onPress={() => setShowType(!showType)}
        >
          <View style = {showType ? styles.showTypeBox : styles.notSelectedBox}>
          </View>
          <Text style={styles.buttonText}>{typeLabel}</Text>
        </TouchableOpacity>
        {(showAll || showType) && <TouchableOpacity style={styles.filterButton}
          onPress={() => setShowCollection(!showCollection)}
          >
          <View style = {(showCollection) ? styles.showCollectionBox : styles.notSelectedBox}>
          </View>
          <Text style={styles.buttonText}>{"in Collection"}</Text>
        </TouchableOpacity>}
      </View>

      <Svg
        width={`${screenWidth}`}
        height={config.CHART_HEIGHT}
        viewBox={`0 0 ${screenWidth} ${config.CHART_HEIGHT}`}
        style={{ borderWidth: 0 }}
      >
        <G
          x={2 * config.CHART_MARGIN} // accommodate label for boundary line
          y={32}
        >
          <SvgText
            fill={config.LABEL_COLOR}
            stroke="none"
            fontSize="12"
            fontWeight="bold"
            fontStyle="italic"
            x={availableWidth / 2}
            y={config.BAR_HEIGHT / 2}
            textAnchor="middle"
          >
            {noResultsMessage}
          </SvgText>
          <XAxis
            availableWidth={availableWidth}
            minDate={minDate}
            maxDate={maxDate}
          />
          <TimelineItems
            availableWidth={availableWidth}
            countForMaxBarHeight={maxCount}
            intervals={intervals}
            showVariance={showVariance}
            showAll={showAll}
            showType = {showType}
            showCollection = {showCollection}
          />
          {(maxCount < 12) && <VerticalBound
            availableWidth={availableWidth}
            countForMaxBarHeight={Math.round(maxCount/4)*4}
          />}

          {(maxCount >= 12) && (showAll || showType)  && <HorizontalLabels
            availableWidth={availableWidth}
            countForMaxBarHeight={Math.round(maxCount/4)*4}
            maxBarHeight = {config.BAR_HEIGHT}
          />}
          {showVariance && false && (
          <VarianceLegend
            maxCount={maxCount}
            maxCount1SD={maxCount1SD}
            maxCount2SD={maxCount2SD}
            recordCount2SDplus={recordCount2SDplus}
          />
          )}
          {/*<GroupingLegend
            availableWidth={availableWidth}
            intervalLength={intervalLength}
          />*/}
          {!showAll && !showType &&
            <SvgText
              fill={config.LABEL_COLOR}
              stroke="none"
              fontSize="12"
              x={availableWidth / 2}
              y={config.BAR_HEIGHT / 2 }
              textAnchor="middle"
            >
              {"nothing selected for display"}
            </SvgText>
          }
          <Rect
            x="0"
            y="0"
            width={availableWidth}
            height={config.BAR_HEIGHT}
            strokeDasharray="2 2"
            // stroke="#f008" // debug position
          />
        </G>
        <Rect
          x="0"
          y="0"
          width={screenWidth}
          height={config.CHART_HEIGHT}
          strokeDasharray="2 2"
          // stroke="#00f8" // debug position
        />
      </Svg>
    </View>
  );
};

TimelineChart.propTypes = {
  timelineIntervals: shape({
    minDate: instanceOf(Date),
    maxDate: instanceOf(Date),
    intervals: arrayOf(shape({
      zScore: number.isRequired,
      items: arrayOf(string).isRequired,
      markedItems: arrayOf(shape({
        subType: string.isRequired,
        marked: arrayOf(string).isRequired,
      }).isRequired).isRequired,
      collectionItems: arrayOf(string).isRequired,
      typeItems:arrayOf(string).isRequired,
      typeCollectionItems:arrayOf(string).isRequired,

    })).isRequired, // that have records
    intervalLength: number.isRequired,
    maxCount: number.isRequired,
    maxCount1SD: number.isRequired,
    maxCount2SD: number.isRequired,
    recordCount: number.isRequired,
    recordCount1SD: number.isRequired,
    recordCount2SD: number.isRequired,
    selectedResourceType: string,

  }).isRequired,
};

const mapStateToProps = (state) => ({
  timelineIntervals: secondaryTimelineIntervalsSelector(state),
  selectedResourceType: activeCollectionResourceTypeSelector(state),
  allTypeFilters: orderedResourceTypeFiltersSelector(state),

});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(TimelineChart));

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: config.CHART_HEIGHT,
  },
  debug: {
    left: 2,
    top: 2,
    fontSize: 6,
  },
  headerText:{
    fontSize: 14,
  },
  textWrapper:{
    width:"100%",
    alignItems: 'center',
    padding:0,
    marginBottom: -10
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom:10,

  },
  buttonText:{
    fontSize: 13,
    paddingLeft:5,
  },
  buttonBar:{
    flexDirection: 'row',
    height:15,
    marginTop:25,
    paddingHorizontal:10,
    marginBottom:-3,
    zIndex:1,
  },
  filterButton:{
    paddingLeft:15,
    color:"red",
    flexDirection: 'row',
  },
  showAllBox:{
    height:15,
    width:15,
    borderWidth:0.5,
    borderRadius:4,
    backgroundColor:Colors.lightgrey
  },
  showTypeBox:{
    height:15,
    width:15,
    borderWidth:0.5,
    borderRadius:4,
    backgroundColor:Colors.primary

  },
  showCollectionBox:{
    height:15,
    width:15,
    borderWidth:0.5,
    borderRadius:4,
    backgroundColor:Colors.collectionIcon

  },
  notSelectedBox:{
    height:15,
    width:15,
    borderWidth:0.5,
    borderRadius:4,
    backgroundColor:"white"
  }
});
