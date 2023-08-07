import React from 'react';
import Slider from '@react-native-community/slider';
import { useTheme } from 'react-native-paper';

function PainScale({ onChange, value, width, height }) {
  const [, setPainValue] = React.useState(1);
  const [painColour, setPainColour] = React.useState('#fffe00');
  const { colors } = useTheme();

  // Grabbed a quick hex lerp instead of writing it myself
  // https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
  /**
   * A linear interpolator for hexadecimal colors
   * @param {String} a
   * @param {String} b
   * @param {Number} amount
   * @example
   * // returns #7F7F7F
   * lerpColor('#000000', '#ffffff', 0.5)
   * @returns {String}
   */
  function lerpColor(a, b, amount) {
    const ah = parseInt(a.replace(/#/g, ''), 16);
    const ar = ah >> 16;
    const ag = (ah >> 8) & 0xff;
    const ab = ah & 0xff;
    const bh = parseInt(b.replace(/#/g, ''), 16);
    const br = bh >> 16;
    const bg = (bh >> 8) & 0xff;
    const bb = bh & 0xff;
    const rr = ar + amount * (br - ar);
    const rg = ag + amount * (bg - ag);
    const rb = ab + amount * (bb - ab);

    return `#${(((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)}`;
  }

  return (
    <Slider
      style={{ flex: 1, thumb: { backgroundColor: 'blue' } }}
      minimumValue={0}
      maximumValue={1}
      step={0.1}
      onValueChange={(value) => {
        setPainValue(value);
        const lerped = lerpColor('#fffe00', '#ff0000', value);
        setPainColour(lerped);
        onChange(value * 100, lerped);
      }}
      thumbTintColor={painColour}
      trackImage={require('../../../assets/images/gradient_pain.png')}
    />
  );
}

export default PainScale;
