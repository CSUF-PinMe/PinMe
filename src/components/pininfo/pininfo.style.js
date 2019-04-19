import {Platform, StyleSheet} from "react-native";

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#03a9f4',
  },
  label: {
    color: 'white',
    fontSize: 28,
    left: 10,
    top: 10,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null
  },
  input: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    marginRight: 20,
    top: 10
  }
});
