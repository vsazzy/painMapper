/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { useTheme, List } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

import ResultsContext from 'contexts/resultsContext';
import { bodyMaskMaleFront, handFootMask, handFootMaskMirrored } from 'utils/base64Images';
import { checkPortrait } from 'utils/utilityFuncs';
import JointResult from 'components/Organisms/JointResult';
import AppHeader from 'components/Organisms/AppHeader';

function JointMapResults({ navigation }) {
  const { colors } = useTheme();
  const resultsContext = React.useContext(ResultsContext);
  const [jointResults, setJointResults] = React.useState([]);
  const [isPortrait, setIsPortrait] = useState(checkPortrait());

  const styles = StyleSheet.create({
    row: { flex: 1, flexDirection: 'row', flexGrow: 1 },
    container: { flex: 1, padding: 10 },
    headerText: {
      textAlign: 'center',
      fontSize: 20,
      color: colors.text,
    },
    scrollableList: { backgroundColor: colors.background, flex: 1 },
    contentContainerStyle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listItem: { width: '100%' },
  });

  React.useEffect(() => {
    setJointResults(resultsContext.jointData);
  }, [resultsContext]);

  // Event Listener for orientation changes
  Dimensions.addEventListener('change', () => {
    setIsPortrait(checkPortrait());
  });

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  // changing height and width so that width always decides the size. It looks the best this way
  const widthDivisor = isPortrait ? 2 : 4;
  const availableHeight = windowHeight * 10;
  const availableWidth = windowWidth / widthDivisor;

  const jointComponents = [
    <JointResult
      key="rightResult"
      canvasKey="right"
      jointManager={jointResults?.right}
      imageString={handFootMask}
      availableHeight={availableHeight}
      availableWidth={availableWidth}
    />,
    <JointResult
      key="bodyResult"
      canvasKey="body"
      jointManager={jointResults?.body}
      imageString={bodyMaskMaleFront}
      availableHeight={availableHeight}
      availableWidth={availableWidth}
    />,
    <JointResult
      key="leftResult"
      canvasKey="left"
      jointManager={jointResults?.left}
      imageString={handFootMaskMirrored}
      availableHeight={availableHeight}
      availableWidth={availableWidth}
    />,
  ];

  return (
    <SafeAreaProvider>
      <AppHeader navigation={navigation} text="Joint Map Results" />

      <View style={styles.row}>
        <View style={styles.container}>
          <ScrollView style={styles.scrollableList}>
            <View style={styles.contentContainerStyle}>
              {jointResults.length === 0 && <List.Item title="No results" style={styles.listItem} />}
              {jointComponents}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

export default JointMapResults;
