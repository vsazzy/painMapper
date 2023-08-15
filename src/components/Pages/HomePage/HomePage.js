import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme, Card, Title, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from 'components/Organisms/AppHeader'
import {
  jointMapScreenName,
  jointMapResultsScreenName,
  painMapResultsScreenName,
  painMapScreenName,
} from 'utils/screenNames';

const norimaLogo = require('assets/images/Norima_Logo.png');

function HomePage({ navigation }) {
  const { colors } = useTheme();
  const elevation = 4;
  const iconSize = 50;
  const avatarSize = 75;

  function onPressPain() {
    navigation.navigate(painMapScreenName);
  }
  function onPressJoint() {
    navigation.navigate(jointMapScreenName);
  }
  function onPressResults() {
    navigation.navigate(jointMapResultsScreenName);
  }

  const styles = StyleSheet.create({
    safeArea: {
      backgroundColor: colors.background,
      flex: 1,
    },
    parentView: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 15,
      paddingTop: 25,
    },
    imageWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    card: {
      flex: 1,
      margin: 5,
    },
    cardContent: {
      // flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatar: {
      backgroundColor: colors.background,
    },
    painIcon: {
      color: colors.components.painIcon,
    },
    jointIcon: {
      color: colors.components.jointIcon,
    },
    slideIcon: {
      color: colors.components.slideIcon,
    },
    resultIcon: {
      color: colors.components.resultIcon,
    },
    hiddenAvatar: {
      backgroundColor: colors.background,
    },
  });

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <AppHeader navigation={navigation} text="Pain Mapper"/>
      <View style={styles.parentView}>
        <View style={styles.row}>
          <Card style={styles.card} onPress={onPressPain} elevation={elevation}>
            <Card.Content style={styles.cardContent}>
              <MaterialCommunityIcons name="human-handsdown" size={iconSize} style={styles.painIcon} />
              <Title style={styles.title}>Pain Map</Title>
            </Card.Content>
          </Card>
          {/* This View and Avatar are only here for spacing */}
          <View style={styles.imageWrapper}>
            <Avatar.Icon icon="ninja" size={avatarSize} style={styles.hiddenAvatar} color={colors.background} />
          </View>
          <Card style={styles.card} onPress={onPressJoint} elevation={elevation}>
            <Card.Content style={styles.cardContent}>
              <MaterialCommunityIcons name="human" size={iconSize} style={styles.jointIcon} />
              <Title style={styles.title}>Joint Map</Title>
            </Card.Content>
          </Card>
        </View>
        <View style={styles.imageWrapper}>
          <Avatar.Image source={norimaLogo} size={avatarSize} style={styles.avatar} />
        </View>
        <View style={styles.row}>
          <Card style={styles.card} onPress={() => navigation.navigate(painMapResultsScreenName)} elevation={elevation}>
            <Card.Content style={styles.cardContent}>
              <MaterialCommunityIcons name="playlist-check" size={iconSize} style={styles.slideIcon} />
              <Title style={styles.title}>Pain Map Results</Title>
            </Card.Content>
          </Card>
          {/* This View and Avatar are only here for spacing */}
          <View style={styles.imageWrapper}>
            <Avatar.Icon icon="ninja" size={avatarSize} style={styles.hiddenAvatar} color={colors.background} />
          </View>
          <Card style={styles.card} onPress={onPressResults} elevation={elevation}>
            <Card.Content style={styles.cardContent}>
              <MaterialCommunityIcons name="playlist-check" size={iconSize} style={styles.resultIcon} />
              <Title style={styles.title}>Joint Map Results</Title>
            </Card.Content>
          </Card>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

export default HomePage;
