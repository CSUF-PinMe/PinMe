import { StyleSheet, Dimensions } from 'react-native';
import React from 'react';

var {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
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
});
