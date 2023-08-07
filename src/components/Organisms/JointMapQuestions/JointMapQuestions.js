import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme, Button, Surface } from 'react-native-paper';

import COLORS from 'utils/colors';

const PAIN_NAME = 'PAIN';
const SWOLLEN_NAME = 'SWOLLEN';
const TENDER_NAME = 'TENDER';

const PAIN_COLOUR = COLORS.painRed;
const SWOLLEN_COLOUR = COLORS.swollenBlue;
const TENDER_COLOUR = COLORS.tenderYellow;

function JointMapQuestions(props) {
  const { joint, onPressDone, updateCanvas } = props;
  const [updateControls, setUpdateControls] = useState(true);
  const { colors } = useTheme();
  const selected = '✓';

  const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 10,
    },
    surface: {
      flex: 1,
      elevation: 4,
    },
    headerContainer: {
      backgroundColor: colors.primary,
      padding: 10,
    },
    headerText: {
      fontSize: 24,
      color: colors.background,
    },
    text: {
      color: colors.background,
    },
    columnBody: {
      flex: 1,
      justifyContent: 'space-around',
      paddingLeft: 5,
      paddingRight: 5,
    },
    responseWrapper: {
      flexGrow: 1,
      justifyContent: 'flex-start',
    },
    doneWrapper: {
      flexGrow: 2,
      justifyContent: 'flex-end'
    },
    button: {
      marginTop: 5,
      marginBottom: 5,
      color: colors.primary,
    },
  });

  function updateAilment(ailmentName, colour) {
    if (joint !== null) {
      if (joint.hasAilment(ailmentName)) {
        joint.removeAilment(ailmentName);
      } else {
        joint.addAilment(ailmentName, colour);
      }
      if (!joint.hasAilments()) {
        updateCanvas();
      } else {
        joint.draw();
      }
    }
  }

  function onPressPain() {
    updateAilment(PAIN_NAME, PAIN_COLOUR);
    setUpdateControls(!updateControls);
  }

  function onPressSwollen() {
    updateAilment(SWOLLEN_NAME, SWOLLEN_COLOUR);
    setUpdateControls(!updateControls);
  }

  function onPressTender() {
    updateAilment(TENDER_NAME, TENDER_COLOUR);
    setUpdateControls(!updateControls);
  }

  function getButtonText(name) {
    let text = '';
    if (joint.hasAilment(name)) {
      text = selected;
    }
    return `${text} ${name}`;
  }

  return (
    <View style={styles.parentContainer}>
      <Surface style={styles.surface}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{joint?.name || ''}</Text>
        </View>
        <View style={styles.columnBody}>
          <View style={styles.responseWrapper}>
            <Button style={styles.button} color={PAIN_COLOUR} mode="contained" onPress={onPressPain}>
              <Text style={styles.text}>{getButtonText(PAIN_NAME)}</Text>
            </Button>
            <Button style={styles.button} color={SWOLLEN_COLOUR} mode="contained" onPress={onPressSwollen}>
              <Text style={styles.text}>{getButtonText(SWOLLEN_NAME)}</Text>
            </Button>
            <Button style={styles.button} color={TENDER_COLOUR} mode="contained" onPress={onPressTender}>
              <Text style={styles.text}>{getButtonText(TENDER_NAME)}</Text>
            </Button>
          </View>
          <View style={styles.doneWrapper}>
            <Button style={styles.button} mode="contained" onPress={onPressDone}>
              DONE
            </Button>
          </View>
        </View>
      </Surface>
    </View>
  );
}

export default JointMapQuestions;
