import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import JointMaps from 'components/Organisms/JointMaps';
import AppHeader from 'components/Organisms/AppHeader';
import ResultsContext from 'contexts/resultsContext';
import styles from './JointMap.style';

function JointMap({ navigation }) {
  const resultsContext = React.useContext(ResultsContext);

  // From context, but to avoid too much coupling with the context this outer layer is going to
  // pass it down as a prop
  function onUpdate(data) {
    resultsContext.setJointData(data);
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <AppHeader text="Joint Map" navigation={navigation} />
      <JointMaps onUpdate={onUpdate} navigation={navigation} />
    </SafeAreaProvider>
  );
}

export default JointMap;
