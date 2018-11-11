import { StyleSheet, Dimensions } from 'react-native';

const {width, height} = Dimensions.get("window");
const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export default StyleSheet.create({
  container: {
    flex: 1,
  },
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
  map: {
    width: Screen.width,
    height: Screen.height, 
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 100,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonContainer: {
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
