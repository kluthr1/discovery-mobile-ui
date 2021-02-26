import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Accordion, Icon} from "native-base";

import Colors from '../../constants/Colors'

const SubTypeAccordion = ({subType, resourcesIds}) => {
  const dataArray = [
    {title: subType, content: resourcesIds},
  ]

  const renderHeader = (item, expanded) => {
    return (
      <View style={{
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
        alignItems: "center" ,
        backgroundColor: Colors.primary,
      }} >
        <View style={{width: '80%'}}>
          <Text style={{color: 'white'}}>{item.title} [{item.content.length}]</Text>
        </View>
        {expanded
          ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
          : <Icon style={{ fontSize: 18 }} name="add-circle" />}
      </View>
    )
  }

  const renderContent = (item) => {
    return item.content.map(resourceId => <View style={{backgroundColor: 'white', padding: 10}}><Text>{resourceId}</Text></View>)
  }

  return (
    <View style={{marginBottom: 10}}>
      <Accordion 
        dataArray={dataArray}
        icon="add" 
        iconStyle={{ color: "green" }}
        expanded={[]}
        renderHeader={renderHeader}
        renderContent={renderContent}
      />
    </View>
  )
}

export default SubTypeAccordion

const styles = StyleSheet.create({})
