import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, List } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ResultsContext from 'contexts/resultsContext';
import { ScrollView } from 'react-native-gesture-handler';
import PainSiteResult from 'components/Pages/PainResults/PainSiteResult';
import PainSiteSummary from 'components/Pages/PainResults/PainSiteSummary';
import AppHeader from 'components/Organisms/AppHeader';

function PainResults({ navigation }) {
  const { colors } = useTheme();
  const resultsContext = React.useContext(ResultsContext);

  const styles = StyleSheet.create({
    row: { flex: 1, flexDirection: 'row' },
    container: { flex: 1, padding: 10 },
    headerText: {
      textAlign: 'center',
      fontSize: 20,
      color: colors.text,
    },
    scrollableList: { backgroundColor: colors.background, flex: 1 },
  });

  return (
    <SafeAreaProvider>
      <AppHeader navigation={navigation} text="Pain Map Results" />

      <View style={styles.container}>
        <ScrollView style={styles.scrollableList}>
          {resultsContext.painData.length === 0 && <List.Item title="No results" />}
          {<PainSiteSummary painDataList={resultsContext?.painData} />}
          {resultsContext.painData.map((pain) => (
            <PainSiteResult key={pain.id} painData={pain} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}

export default PainResults;
