import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  touchableConatiner: {
    backgroundColor: 'white',
    height: 350,
    width: 350,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: 'normal',
    letterSpacing: 0.25,
    paddingLeft: 12,
    paddingBottom: 12,
    paddingTop: 12,
  },
  mapBorder: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'grey',
  },
  map: {
    borderTopWidth: 5,
    height: 200,
  },

  statistics: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'normal',
    letterSpacing: 0.25,
    color: 'grey',
    padding: 4,
  },
});
