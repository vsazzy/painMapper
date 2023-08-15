import React from 'react';
import { useColorScheme } from 'react-native';
// import * as Updates from 'expo-updates';
import { I18nManager } from 'react-native';
import { PaperProvider } from 'react-native-paper';
// Our stuff
// Note: Imports are not relative off of src here, any imports inside src use that folder as root
import RootNavigator from './src/navigators/RootNavigator';
import { PreferencesContext } from './src/contexts/preferencesContext';
import baseTheme from './src/themes/baseTheme';
import ResultsContext from './src/contexts/resultsContext';

function App() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState(colorScheme === 'dark' ? 'dark' : 'light');
  const [rtl] = React.useState(I18nManager.isRTL);
  const [jointData, setJointData] = React.useState([]);
  const [painData, setPainData] = React.useState([]);

  function toggleTheme() {
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
  }

  function addPainData(data) {
    // make up an id. TODO: Use a UUID or shortid
    const id = painData.length + 1;
    data.setId(id);
    const newData = painData.concat([data]);
    setPainData(newData);
  }

  const toggleRTL = React.useCallback(() => {
    I18nManager.forceRTL(!rtl);
    // Updates.reloadAsync();
  }, [rtl]);

  // Memoization is tricky, look up tutorials for this
  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      toggleRTL,
      theme,
      rtl: rtl ? 'right' : 'left',
    }),
    [rtl, theme, toggleRTL],
    // [theme],
  );

  // Trying to keep App.js fairly minimal
  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={theme === 'light' ? baseTheme.light : baseTheme.dark}>
        <ResultsContext.Provider value={{ painData, jointData, setJointData, addPainData }}>
          <RootNavigator />
        </ResultsContext.Provider>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}

export default App;
