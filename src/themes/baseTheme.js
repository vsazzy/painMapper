import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';
import COLORS from 'utils/colors';

const lightTheme = {
  ...DefaultTheme,
  dark: false,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00a2f0',
    accent: COLORS.accent,
    components: {
      painIcon: COLORS.components.painIcon,
      jointIcon: COLORS.components.jointIcon,
      slideIcon: COLORS.components.slideIcon,
      resultIcon: COLORS.components.resultIcon,
      canvasBackground: COLORS.components.canvasBackground,
      modifierSelected: COLORS.components.modifierSelected,
      modifierNotSelected: COLORS.components.modifierNotSelected,
      modTextSelected: COLORS.white,
      modTextNotSelected: COLORS.darkGrey,
    },
  },
};
const darkTheme = {
  ...DarkTheme,
  mode: 'exact',
  dark: true,
  roundness: 2,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.primary,
    accent: COLORS.accent,
    components: {
      painIcon: COLORS.components.painIcon,
      jointIcon: COLORS.components.jointIcon,
      slideIcon: COLORS.components.slideIcon,
      resultIcon: COLORS.components.resultIcon,
      canvasBackground: COLORS.components.canvasBackgroundDark,
      modifierSelected: COLORS.components.modifierSelectedDark,
      modifierNotSelected: COLORS.components.modifierNotSelectedDark,
      modTextSelected: COLORS.white,
      modTextNotSelected: COLORS.black,
    },
  },
};

export default { light: lightTheme, dark: darkTheme };
