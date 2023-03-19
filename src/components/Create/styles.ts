import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#212531',
  },
  image: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 5,
    height: '50%',
    width: '100%',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  metricsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '30%',
    marginTop: 18,
  },
  buttonsContainer: {
    marginTop: 12,
    height: '15%',
    width: '100%',
  },

  cameraButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
    left: 30,
  },

  stopButton: {
    position: 'absolute',
    bottom: 20,
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: '#C8391C',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
