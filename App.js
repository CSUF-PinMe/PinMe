import React from 'react';
import { Button, View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { createStackNavigator, createDrawerNavigator, DrawerItems } from 'react-navigation'; // Version can be specified in package.json
import { fadeIn, zoomIn } from 'react-navigation-transitions';
import { Container, Icon, Content, Header, Body} from 'native-base'

import MapScreen from './src/components/map/map.component';
import AddPinMap from './src/components/addpinmap/addpinmap.component';
import PinInfo from './src/components/pininfo/pininfo.component';
import SearchScreen from './src/components/search/search.component';
import MyPinsScreen from './src/components/mypins/mypins.component';

import Expo, { Constants, Location, Permissions } from 'expo';
import createStore from 'pure-store';

import { withAuthenticator } from 'aws-amplify-react-native';
import {Auth} from 'aws-amplify'
import Amplify from '@aws-amplify/core'
import config from './aws-exports'


Amplify.configure(config)

export const store = createStore({
  initialMarkers: [],
  markers: [],
  currentUser: '',
  testMarkers: [],
  latitude: 36.812617,
  longitude: -119.745802,
  latitudeDelta: 0.0422,
  longitudeDelta: 0.0221,
  pinInfo: {                // Used for map-link: opening pins in uber, lyft, waze, etc..
    name: undefined,
    latitude: undefined,
    longitude: undefined
  }
})

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      location: null,
      errorMessage: null,
      loading: true
    }
  }

  async componentDidMount() {
    this._getLocationAsync();
    await Expo.Font.loadAsync({
      MaterialIcons: require('react-native-vector-icons/Fonts/MaterialIcons.ttf'),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
    });
    Auth.currentUserInfo().then(res => store.update({currentUser: res.username}));
    this.setState({
      loading: false
     });
  }


  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    } else {
      console.log('Permission to access location was granted!');
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };
  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return <MyApp />;
  }
}

export default withAuthenticator(App , /*{ includeGreetings: true }*/)

const RootStack = createStackNavigator(
  {
    Map: MapScreen,
    AddPin: AddPinMap,
    PinInfo: PinInfo,
    Search: SearchScreen
  },
);

const CustomDrawerContentComponent = (props) => (

  <SafeAreaView style = {{flex:1}}>
    <Header style={styles.drawerHeader}>
      <Body>
        <Image
          style={styles.drawerImage}
          source={require('./assets/icon.png')} />
      </Body>
    </Header>
    <Content>
      <DrawerItems {...props} />
    </Content>
  </SafeAreaView>

);

const MyApp = createDrawerNavigator({
    Search: SearchScreen,
    Map: MapScreen,
    MyPins: MyPinsScreen,
    AddPin:{
      screen: AddPinMap,
      navigationOptions: {
      drawerLabel: ()=>null
      }
    },
    PinInfo: {
      screen: PinInfo,
      navigationOptions: {
      drawerLabel: ()=>null
      }
    }
},
{
  initialRouteName: 'Map',
  transitionConfig: () => fadeIn(),
  drawerPosition: 'left',
  headerMode: 'screen',
  contentComponent: CustomDrawerContentComponent,
  contentOptions: {
    activeTintColor: 'blue',
    inactiveTintColor: 'blue',
  }
}, {});

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    drawerHeader: {
      height: 200,
      backgroundColor: 'white',
      alignItems: 'center'
    },
    drawerImage: {
      height: 150,
      width: 150,
      borderRadius: 75,
      alignSelf: 'center'
    }
});
