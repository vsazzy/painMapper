import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useTheme, Button, List, Surface } from 'react-native-paper';

function JointMapControls(props) {
  const { onPressRight, onPressBody, onPressLeft, onPressFinish, results, portrait } = props;
  const { colors } = useTheme();

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
      color: colors.text,
    },
    container: {
      flex: 1,
      paddingLeft: 5,
      paddingRight: 5,
    },
    buttonCol: {
      justifyContent: 'flex-end',
      flexDirection: 'column',
      paddingLeft: 5,
      paddingRight: 5,
    },
    button: {
      marginTop: 5,
      marginBottom: 5,
      color: colors.primary,
    },
  });

  const portraitButtons = (
    <>
      <Button style={styles.button} onPress={onPressRight} mode="contained">
        Right Appendages
      </Button>
      <Button style={styles.button} onPress={onPressBody} mode="contained">
        Body
      </Button>
      <Button style={styles.button} onPress={onPressLeft} mode="contained">
        Left Appendages
      </Button>
    </>
  );
  let buttons = <></>;
  if (portrait) {
    buttons = portraitButtons;
  }

  return (
    <View style={styles.parentContainer}>
      <Surface style={styles.surface}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Joints</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.text}>Touch a joint marker to begin</Text>
          <ScrollView>
            {results.map((result) => (
              <List.Item key={result.name} title={result.name} description={result.ailments} />
            ))}
          </ScrollView>
        </View>
        <View style={styles.buttonCol}>
          {buttons}
          <Button style={styles.button} onPress={onPressFinish} mode="contained">
            Finish
          </Button>
        </View>
      </Surface>
    </View>
  );
}

export default JointMapControls;
