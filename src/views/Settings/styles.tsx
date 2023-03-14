import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212531',
  },
  image: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topButtonView: {
    height: 100,
  },
  bottomButtonView: {
    marginTop: 375,
    height: 100,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 50,
    marginBottom: 24,
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#6A71E6',
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 50,
    marginBottom: 24,
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#C8391C',
  },
  text: {
    fontSize: 21,
    lineHeight: 24,
    fontWeight: 'normal',
    letterSpacing: 0.25,
    color: 'white',
  },
});
