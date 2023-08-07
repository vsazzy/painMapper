import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import JointManager from 'components/Atoms/JointManager';
import JointMapCanvas from 'components/Molecules/JointMapCanvas';

function JointResult({ jointManager, imageString, availableHeight, availableWidth, canvasKey }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    row: { flex: 1, flexDirection: 'row', flexGrow: 1 },
    column: { flexDirection: 'column', alignItems: 'center', flex: 1 },
    listItem: {
      width: '100%'
    },
    grayView: {
      backgroundColor: colors.components.canvasBackground,
      flex: 1,
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  function onJointPress() {
    // don't do anything
  }

  const dummyJoints = new JointManager();
  const canvas = (
    <JointMapCanvas
      key={canvasKey}
      availableHeight={availableHeight}
      availableWidth={availableWidth}
      onJointPress={onJointPress}
      joints={jointManager || dummyJoints}
      imageString={imageString}
    />
  );

  function getListItems(array) {
    return array.map((joint) => (
      <List.Item style={styles.listItem} key={joint.name} title={joint.name} description={joint.ailments} />
    ));
  }


  if (jointManager?.joints && jointManager.joints.length > 0) {
    return (
      <View key={`${canvasKey}row`} style={styles.row}>
        <View key={`${canvasKey}gray`} style={styles.grayView} >
          {canvas}
        </View>
        <View key={`${canvasKey}col`} style={[styles.column, { width: availableWidth }]}>
          {getListItems(jointManager.getResultsArray())}
        </View>
      </View>
    );
  }
  return <></>;
}

export default JointResult;
