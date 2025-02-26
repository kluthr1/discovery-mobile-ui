import React, { memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { withFadeAnimation } from './HOC/withFadeAnimation'

export const NothingFound = memo(({...props}) => {
  const EL = withFadeAnimation(
    () => (
      <View style={{ ...styles.container }}>
        <Text style={styles.text}>{props.emptyResultText || 'Nothing found'}</Text>
      </View>
    ),
    {}
  )
  return <EL></EL>
})

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  text: { textAlign: 'center' },
})
