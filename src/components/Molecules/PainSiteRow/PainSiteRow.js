import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './PainSiteRow.style';

function PainSiteRow({ label }) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="map-marker" size={32} />
      <Text style={styles.text} key={label}>
        PainSite: {label}
      </Text>
    </View>
  );
}

export default PainSiteRow;
