import { StyleSheet } from 'react-native';
import COLORS from 'utils/colors'; // eslint-disable-line import/no-unresolved

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.defaultThemeWhite,
    margin: 2,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    color: COLORS.black,
  },
  body: {
    flex: 1,
  },
  footer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: COLORS.darkGrey,
  },
});

export default styles;
