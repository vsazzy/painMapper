import React from 'react';
import { View } from 'react-native';
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import { Avatar, Title, Caption, Drawer, Text, TouchableRipple, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { PreferencesContext } from 'contexts/preferencesContext';
import COLORS from 'utils/colors';

import {
  homePageScreenName,
  jointMapScreenName,
  painMapResultsScreenName,
  painMapScreenName,
  jointMapResultsScreenName,
} from 'utils/screenNames';
import styles from './DrawerContent.style';

// const norimaLogo = require('../../../assets/images/norima_logo_icon.png'); old logo
//new logo
const norimaLogo = require('assets/images/painmapperLogo.jpeg'); 

function DrawerContent(props) {
  const { theme, toggleTheme, rtl, toggleRTL } = React.useContext(PreferencesContext);

  const isDarkTheme = theme === 'dark';
  const avatarTheme = isDarkTheme
    ? { colors: { primary: COLORS.darkThemeBlack } }
    : { colors: { primary: COLORS.defaultThemeWhite } };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Avatar.Image source={norimaLogo} size={50} theme={avatarTheme} />
            <View style={{ paddingLeft: 20 }}>
              <Title style={styles.title}>Pain Mapper</Title>
              {/* <Caption style={styles.caption}>A Demo Project</Caption> */}
            </View>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />}
            label="Home"
            onPress={() => props.navigation.navigate(homePageScreenName)}
          />
          <DrawerItem
            icon={({ color, size }) => <MaterialCommunityIcons name="human-handsdown" color={color} size={size} />}
            label="Pain Map"
            onPress={() => props.navigation.navigate(painMapScreenName)}
          />
          <DrawerItem
            icon={({ color, size }) => <MaterialCommunityIcons name="playlist-check" color={color} size={size} />}
            label="Pain Map Results"
            onPress={() => props.navigation.navigate(painMapResultsScreenName)}
          />
          <DrawerItem
            icon={({ color, size }) => <MaterialCommunityIcons name="human" color={color} size={size} />}
            label="Joint Map"
            onPress={() => props.navigation.navigate(jointMapScreenName)}
          />
          <DrawerItem
            icon={({ color, size }) => <MaterialCommunityIcons name="playlist-check" color={color} size={size} />}
            label="Joint Map Results"
            onPress={() => props.navigation.navigate(jointMapResultsScreenName)}
          />
        </Drawer.Section>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={toggleTheme}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={isDarkTheme} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={toggleRTL}>
            <View style={styles.preference}>
              <Text>RTL</Text>
              <View pointerEvents="none">
                <Switch value={rtl === 'right'} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}

export default DrawerContent;
