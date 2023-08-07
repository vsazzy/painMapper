/* eslint-disable import/no-unresolved */

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import * as RECURRENCE from 'utils/recurrenceStrings';

import COLORS from 'utils/colors';
import PainScale from 'components/Molecules/PainScale';
import PainControlsButton from 'components/Molecules/PainControlsButton';

function PainMapQuestions(props) {
  const { painIntensity, painRecurrence, onSeverityChange, onRecurrenceChange, onDone, onDelete, onNext } = props;
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      margin: 2,
    },
    header: {
      backgroundColor: colors.background,
      padding: 10,
      borderColor: COLORS.darkGrey,
      borderBottomWidth: 1,
    },
    headerText: {
      fontSize: 24,
      color: colors.text,
    },
    scroll: {
      flex: 1,
    },
    subHeaderText: {
      fontSize: 18,
      margin: 10,
      color: colors.text,
    },
    recurrenceButton: {
      flex: 1,
      margin: 10,
    },
    content: {
      margin: 10,
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pain Capture</Text>
      </View>
      <ScrollView style={styles.scroll}>
        <Text style={styles.subHeaderText}>Pain Severity</Text>
        <Text style={styles.content}>
          Using your finger, paint the part of the body where you feel pain. Then, move the slider below to indicate how
          severe your pain has been.
        </Text>
        <PainScale style={styles.slider} onChange={onSeverityChange} value={painIntensity} width={300} height={50} />

        <Text style={styles.subHeaderText}>How often do you feel this pain?</Text>
        <Button
          style={styles.recurrenceButton}
          mode={painRecurrence === RECURRENCE.WEEKLY ? 'contained' : false}
          onPress={() => {
            onRecurrenceChange(RECURRENCE.WEEKLY);
          }}
        >
          Once a week
        </Button>
        <Button
          style={styles.recurrenceButton}
          mode={painRecurrence === RECURRENCE.DAILY ? 'contained' : false}
          onPress={() => {
            onRecurrenceChange(RECURRENCE.DAILY);
          }}
        >
          Once a day
        </Button>
        <Button
          style={styles.recurrenceButton}
          mode={painRecurrence === RECURRENCE.MULTIPLE_PER_DAY ? 'contained' : false}
          onPress={() => {
            onRecurrenceChange(RECURRENCE.MULTIPLE_PER_DAY);
          }}
        >
          Multiple times a day
        </Button>
      </ScrollView>
      <View>
        <PainControlsButton text="Clear" onPress={onDelete} />
        <PainControlsButton text="Add New Pain Map" onPress={onNext} />
        <PainControlsButton text="View Results" onPress={onDone} />
      </View>
    </View>
  );
}

PainMapQuestions.propTypes = {
  painIntensity: PropTypes.number.isRequired,
  painRecurrence: PropTypes.string.isRequired,
  onSeverityChange: PropTypes.func.isRequired,
  onRecurrenceChange: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default PainMapQuestions;
