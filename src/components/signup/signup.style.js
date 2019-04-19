import {Dimensions, Platform, StyleSheet} from "react-native";

const {width, height} = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  authMessage: {
    color: "white",
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null,
    bottom: Platform.OS === 'ios' ? 40 : 20,
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 20
  },
  confirm: {
    left:20,
    bottom: 50,
    color: 'white',
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null
  },
  error: {
    color: "white",
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null,
    bottom: 60,
  },
  title: {
    position: 'absolute',
    left: 15,
    color: 'white',
    fontSize: 60,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "100" : null,
    top: Platform.OS === 'ios' ? 30 : 0,
  },
  label: {
    color: 'white',
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null
  },
  input: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    marginRight: 20,
    top: 3,
  },
  inputItem: {
    bottom: 50,
    left: 15,
    borderColor: 'transparent'
  },
  buttonText: {
    color: '#03a9f4',
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light'
  },
  leftButton: {
    width: width/2-20,
    height: 55,
    marginLeft: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    bottom: Platform.OS === 'ios' ? 15 : 0
  },
  rightButton: {
    width: width/2-20,
    height: 55,
    marginRight: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    bottom: Platform.OS === 'ios' ? 15 : 0
  }
});
