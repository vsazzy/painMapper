import React from 'react';
import { Button } from 'react-native-paper';
import COLORS from 'utils/colors';
import styles from './PainControlsButton.style';

function PainControlsButton({ text, onPress }) {
  return (
    <Button style={styles.button} uppercase mode="contained" color={COLORS.primary} onPress={onPress}>
      {text}
    </Button>
  );
}

export default PainControlsButton;
