import { StyleSheet, Dimensions, Platform } from 'react-native';
import React from 'react';

var {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  error: {
    color: "white",
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    bottom: Platform.OS === 'ios' ? 20 : 0
  },
  image: {
      flex: 1,
      width: 90,
      height: 90,
      resizeMode: 'contain'
  },
  actionButtonIcon: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
  },
  button1Container: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  button2Container: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  scrollContainer: {
    height: height*.6,
    backgroundColor: '#03a9f4',
  },
  label: {
    color: 'white',
    fontSize: 24,
    left: 10,
    top: 10,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null
  },
  descInput: {
    color: 'white',
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    marginRight: 20,
    top: 15,
    left: 5
  },
  input: {
    color: 'white',
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    marginRight: 20,
    top: 12
  },
  leftButton: {
    width: width/2-40,
    height: 40,
    marginLeft: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    bottom: Platform.OS === 'ios' ? 15 : 0
  },
  rightButton: {
    width: width/2-40,
    height: 40,
    marginRight: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    bottom: Platform.OS === 'ios' ? 15 : 0
  },
  buttonText: {
    color: '#03a9f4',
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light',
  },
});
