import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    // backgroundColor: '#212531',
  },
  map: {
    height: '50%',
    width: '100%',
  },
  metrics: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stopButton: {
    backgroundColor: 'orange',
    width: '70%',
    height: 40,
  },
  cameraButton: {
    width: '30%',
    height: 40,
  },
});
