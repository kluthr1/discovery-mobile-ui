import React, { useState, useEffect} from 'react';
import { func, instanceOf, shape } from 'prop-types';
import {
  Platform, StyleSheet, View, Text, TouchableOpacity, Alert
} from 'react-native';
import { connect } from 'react-redux';
import {
  min, max, startOfDay, endOfDay,
} from 'date-fns';

import { updateDateRange } from '../../redux/action-creators';
import DatePicker from './DatePicker';
import { timelinePropsSelector, activeCollectionDateRangeFilterSelector } from '../../redux/selectors';
import Colors from '../../constants/Colors';

const SetDateFilter = ({ timelineProps, dateRangeFilter, updateDateRangeFilter }) => {
  const { minimumDate, maximumDate } = timelineProps;
  if (!minimumDate || !maximumDate) {
    return null;
  }

  const { dateRangeStart = minimumDate, dateRangeEnd = maximumDate } = dateRangeFilter;
  /*
    button constants
    Custom: -1
    All: 0
    1 year: 1
    6 months: 2
    1 month: 3
    1 week: 4
  */
  const [buttonStyles, setButtonStyles] = useState([
    styles.rowButton,
    styles.rowButton,
    styles.rowButton,
    styles.rowButton,
    styles.rowButton
  ])
  const [textStyles, setTextStyles] = useState([
    styles.buttonText,
    styles.buttonText,
    styles.buttonText,
    styles.buttonText,
    styles.buttonText
  ])
  const [selectedItem, setSelectedItem] = useState(-1)

  useEffect(() => {
    button_styles_array = []
    text_styles_array = []
    for(var i = 0; i < 5; i++){
      if (selectedItem == i){
        text_styles_array.push([styles.buttonText, styles.selectedText])

        if(i == 0){
          button_styles_array.push([styles.rowButton, styles.selected, styles.leftRowButton])
        }
        else if(i == 4){
          button_styles_array.push([styles.rowButton, styles.selected, styles.rightRowButton])
        }
        else{
            button_styles_array.push(
              [styles.rowButton , styles.selected])

        }
      }else{
        button_styles_array.push([styles.rowButton])
        text_styles_array.push([styles.buttonText])
      }
    }
    switch (selectedItem) {
      case -1:
            break;
      case 0:
        updateDateRangeFilter('dateRangeStart', startOfDay(minimumDate))

        updateDateRangeFilter('dateRangeEnd', endOfDay(maximumDate))
        break;
      case 1:
        var date = new Date(maximumDate.getTime());
        date.setMonth(date.getMonth() - 12);

        updateDateRangeFilter('dateRangeStart', startOfDay(date))

        updateDateRangeFilter('dateRangeEnd', endOfDay(maximumDate))
        break;
      case 2:
        var date = new Date(maximumDate.getTime());
        date.setMonth(date.getMonth() - 6);

        updateDateRangeFilter('dateRangeStart', startOfDay(date))

        updateDateRangeFilter('dateRangeEnd', endOfDay(maximumDate))
        break;
      case 3:

        var date = new Date(maximumDate.getTime());
        date.setMonth(date.getMonth() - 1);

        updateDateRangeFilter('dateRangeStart', startOfDay(date))

        updateDateRangeFilter('dateRangeEnd', endOfDay(maximumDate))
        break;
      case 4:
        var date = new Date(maximumDate.getTime() - (7 * 24 * 60 * 60 * 1000));

        updateDateRangeFilter('dateRangeStart', startOfDay(date))

        updateDateRangeFilter('dateRangeEnd', endOfDay(maximumDate))
        //button_styles_array[4] = [styles.rowButton, styles.rightRowButton, styles.selectedText]

        break;
    }
    setTextStyles(text_styles_array)
    setButtonStyles(button_styles_array)
  }, [selectedItem]);

  useEffect(() => {
    if (dateRangeFilter["dateRangeEnd"] && dateRangeFilter["dateRangeStart"]){
    var end_date = new Date(dateRangeFilter["dateRangeEnd"].getTime())
    end_date.setHours(0, 0, 0, 0);

    var start_date = new Date(dateRangeFilter["dateRangeStart"].getTime())
    start_date.setHours(0, 0, 0, 0);

    var maxDate  = new Date(maximumDate.getTime())
    maxDate.setHours(0, 0, 0, 0);

    if (end_date.getTime() == maxDate.getTime()){
      switch (selectedItem) {
        case -1:
              break;
        case 0:
          var minDate  = new Date(minimumDate.getTime())
          minDate.setHours(0, 0, 0, 0);
          if (start_date.getTime() != minDate.getTime()){
            setSelectedItem(-1)
          }
          break;
        case 1:
          var date = new Date(maxDate.getTime());
          date.setMonth(date.getMonth() - 12);
          if (start_date.getTime() != date.getTime()){
            setSelectedItem(-1)
          }

          break;
        case 2:
          var date = new Date(maxDate.getTime());
          date.setMonth(date.getMonth() - 6);
          if (start_date.getTime() != date.getTime()){
            setSelectedItem(-1)
          }
          break;
        case 3:

          var date = new Date(maxDate.getTime());
          date.setMonth(date.getMonth() - 1);
          if (start_date.getTime() != date.getTime()){
            setSelectedItem(-1)
          }
          break;
        case 4:
          var date = new Date(maxDate.getTime() - (7 * 24 * 60 * 60 * 1000));
          if (start_date.getTime() != date.getTime()){
            setSelectedItem(-1)
          }
          break;
      }
    }else{


      setSelectedItem(-1)

    }
  }


  },[dateRangeFilter]);


  return (
    <View style={styles.container}>
      <View style={[styles.rowButtonContainer, styles.leftRowButton]}>
        <TouchableOpacity
          onPress={() => setSelectedItem(0)}
          style={buttonStyles[0]}
        >
          <Text style = {textStyles[0]}>
          {"All"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rowButtonContainer}>
      <TouchableOpacity
        onPress={() => setSelectedItem(1)}
        style={buttonStyles[1]}
      >
        <Text style = {textStyles[1]}>
        {"1 year"}
        </Text>
      </TouchableOpacity>
      </View>


      <View style={styles.rowButtonContainer}>
      <TouchableOpacity
        onPress={() => setSelectedItem(2)}
        style={buttonStyles[2]}
      >
        <Text style = {textStyles[2]}>
        {"6 months"}
        </Text>
      </TouchableOpacity>
      </View>

      <View style={styles.rowButtonContainer}>
      <TouchableOpacity
        onPress={() => setSelectedItem(3)}
        style={buttonStyles[3]}
      >
        <Text style = {textStyles[3]}>
        {"1 month"}
        </Text>
      </TouchableOpacity>
      </View>

      <View style={[styles.rowButtonContainer, styles.rightRowButton]}>
      <TouchableOpacity
        onPress={() => setSelectedItem(4)}
        style={buttonStyles[4]}
      >
        <Text style = {textStyles[4]}>
        {"1 week"}
        </Text>
      </TouchableOpacity>

      </View>
    </View>
  );
};

SetDateFilter.propTypes = {
  timelineProps: shape({
    minimumDate: instanceOf(Date),
    maximumDate: instanceOf(Date),
  }).isRequired,
  dateRangeFilter: shape({
    dateRangeStart: instanceOf(Date),
    dateRangeEnd: instanceOf(Date),
  }).isRequired,
  updateDateRangeFilter: func.isRequired,
};

const mapStateToProps = (state) => ({
  timelineProps: timelinePropsSelector(state),
  dateRangeFilter: activeCollectionDateRangeFilterSelector(state),
});

const mapDispatchToProps = {
  updateDateRangeFilter: updateDateRange,
};

export default connect(mapStateToProps, mapDispatchToProps)(SetDateFilter);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal:10,
    borderWidth: 0.75,

  },
  dash: {
    paddingLeft: Platform.OS === 'ios' ? 0 : 8,
    paddingRight: 8,
    fontSize: 30,
    color: Colors.dash,
  },
  rowButtonContainer: {
    width:"20%",
    borderWidth:0.25,
    borderLeftWidth: 0,

    height:20,
  },
  leftRowButton:{
    borderBottomLeftRadius: 5,
    borderTopLeftRadius:5,
  },
  rightRowButton:{
    borderBottomRightRadius: 5,
    borderTopRightRadius:5,
  },
  rowButton: {
    width:"100%",
    height:"100%",
    borderWidth:0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 3,

  },
  selected:{
    //backgroundColor: Colors.primary
    height:'99%',
    borderWidth:1


  },
  buttonText:{
    left: 2,
    top: 2,
    fontSize: 12,
  },
  selectedText:{
    fontWeight: "bold",
    //color: 'white'


  }
});
