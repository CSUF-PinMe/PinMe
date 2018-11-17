import { StyleSheet, Dimensions } from 'react-native';

const {width, height} = Dimensions.get("window");
const Screen = {
  width: Dimensions.get('window').width,
  height: '100%',
};

export default StyleSheet.create({
  mapContainer: {
    width: Screen.width,
    height: Screen.height,
  },
  mapDrawerOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.0,
    height: Dimensions.get('window').height,
    width: 10,
  },

  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    width: 100,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonContainer: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    top: 20,
    left: 20
  },
  buttonText: {
    textAlign: 'center',
    position: 'absolute'
  },
  mapDrawerOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.0,
    height: Dimensions.get('window').height,
    width: 10,
  },
  });
