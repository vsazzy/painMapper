import { StyleSheet } from 'react-native';
import COLORS from 'utils/colors';

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: 'row' },
  container: { flex: 1, padding: 10 },
  headerText: {
    textAlign: 'center',
    fontSize: 20,
  },
  scrollableList: { backgroundColor: 'white', flex: 1 },
});

export default styles;
