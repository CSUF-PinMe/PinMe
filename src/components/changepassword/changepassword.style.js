import {Dimensions, Platform, StyleSheet} from "react-native";
var {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  authMessage: {
    color: "white",
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 40,
    fontSize: 20
  },
  label: {
    color: 'white',
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null
  },
  title: {
    position: 'absolute',
    left: 15,
    color: 'white',
    fontSize: 60,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "100" : null
  },
  error: {
    bottom: 90,
    color: "white",
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null,
    left: 19
  },
  input: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light',
    marginRight: 20,
    top: 3,
  },
  inputItem: {
    bottom: 80,
    left: 15,
    borderColor: 'transparent'
  },
  buttonText: {
    color: '#03a9f4',
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light',
  },
  leftButton: {
    width: width/2-20,
    height: 55,
    marginLeft: 5,
    justifyContent: 'center',
    backgroundColor: 'white',
    bottom: Platform.OS === 'ios' ? 15 : 0
  },
  rightButton: {
    width: width/2-20,
    height: 55,
    marginRight: 5,
    justifyContent: 'center',
    backgroundColor: 'white',
    bottom: Platform.OS === 'ios' ? 15 : 0
  }
});
