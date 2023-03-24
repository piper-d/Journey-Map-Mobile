import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    color: 'grey',
    height: 250,
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'grey',
  },
  add: {
    // alignContent: 'center',
    backgroundColor: '#DEDEDE',
    height: 150,
    width: 100,
    // width: '20%',
    left: 20,
    bottom: -50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageLength: {
    position: 'absolute',
    backgroundColor: 'white',
    right: 0,
    top: 0,
    height: 30,
    width: 30,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageContainer: {},
});
