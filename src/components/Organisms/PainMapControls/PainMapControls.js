/* eslint-disable import/no-unresolved */

import React from 'react';
import { View, Text } from 'react-native';
import COLORS from 'utils/colors';

import PainSiteRow from 'components/Molecules/PainSiteRow';
import PainControlsButton from 'components/Molecules/PainControlsButton';

import styles from './PainMapControls.style';

function PainMapControls({ painSites }) {
  const painSiteMarkup = painSites.map((painSite) => <PainSiteRow label={painSite.label} />);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pain Capture</Text>
      </View>
      <View style={styles.body}>
        <Text>Touch the screen to add a pain site.</Text>
        <Text style={{ color: COLORS.primary, fontSize: 18, margin: 5 }}>Pain Sites</Text>
        {painSiteMarkup}
      </View>
      <View style={styles.footer}>
        <PainControlsButton text="Back" />
        <PainControlsButton text="Next" />
        <PainControlsButton text="Exit" />
      </View>
    </View>
  );
}

export default PainMapControls;
