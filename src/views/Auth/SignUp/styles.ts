import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212531',
  },
  input: {
    height: 50,
    width: 250,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 50,
    margin: 12,
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#6A71E6',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 21,
    lineHeight: 24,
    fontWeight: 'normal',
    letterSpacing: 0.25,
    color: 'white',
  },
});
