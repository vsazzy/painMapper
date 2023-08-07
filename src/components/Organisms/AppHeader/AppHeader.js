import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

function AppHeader({ navigation, text }) {

  const styles = StyleSheet.create({
    title: {
      alignSelf: 'center',
    }
  });

  return (
    <Appbar.Header>
      <Appbar.Action
        icon="menu"
        onPress={() => {
          navigation?.openDrawer();
        }}
      />
      <Appbar.Content title={text} style={styles.title}/>
    </Appbar.Header>
  );
}

export default AppHeader;
