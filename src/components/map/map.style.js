import { StyleSheet, Dimensions, Platform } from 'react-native';

const {width, height} = Dimensions.get("window");
const Screen = {
  width: Dimensions.get('window').width,
  height: '100%',
};

export default StyleSheet.create({
    modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderRadius: 4,
    borderColor: "white",
    borderWidth: 2,
    marginHorizontal: 20,
    marginVertical: 150
  },
  description: {
    padding: 20,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light'
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: '#03a9f4',
  },
  mapContainer: {
    width: Screen.width,
    height: Screen.height,
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
  pinModal: {
    height: height*.70,
    width: width*.80,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2,
  },
  pinModalTitle: {
    marginLeft: 30,
    marginRight: 45,
    fontSize: 30,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light',
    color: '#03a9f4'
  },
  pinModalLabel: {
    marginLeft: 10,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light',
    fontSize: 20,
    fontWeight: '300',
    color: '#03a9f4'
  },
  pinModalDescription: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light'
  },
  pinModalImage: {
    width: width*.70,
    height: width*.70,
    left: 15
  },
  pinModalTrash: {
    color: '#9e9e9e',
    left: 10
  }
  });
