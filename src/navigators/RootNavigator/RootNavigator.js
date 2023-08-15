import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from 'react-native-paper';

import DrawerContent from 'components/Organisms/DrawerContent';
import HomePage from 'components/Pages/HomePage';
import PainMap from 'components/Pages/PainMap';
import JointMap from 'components/Pages/JointMap';
import JointMapResults from 'components/Pages/JointMapResults';
import PainResults from 'components/Pages/PainResults';
import {
  homePageScreenName,
  jointMapScreenName,
  painMapScreenName,
  painMapResultsScreenName,
  jointMapResultsScreenName,
} from 'utils/screenNames';

const Drawer = createDrawerNavigator();

// The type of navigator for this may need to change in the future
// You can nest navigators
export const RootNavigator = () => {
  const theme = useTheme();
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  // Temp?
  const [painMapData, setPainMapData] = React.useState({});
  const [jointData, setJointData] = React.useState([]);

  React.useEffect(() => {
    console.log(jointData);
  }, [jointData]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name={homePageScreenName} component={HomePage} />
        <Drawer.Screen name={painMapScreenName} component={PainMap} />
        <Drawer.Screen name={jointMapScreenName} component={JointMap} />
        <Drawer.Screen name={painMapResultsScreenName} component={PainResults} />
        <Drawer.Screen name={jointMapResultsScreenName} component={JointMapResults} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;