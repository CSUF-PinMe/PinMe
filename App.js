import React from 'react';
import { Button, View, Text, StyleSheet, Image } from 'react-native';
import { createStackNavigator, createDrawerNavigator, DrawerItems } from 'react-navigation'; // Version can be specified in package.json
import { fadeIn, zoomIn } from 'react-navigation-transitions';
import { Container, Icon, Content, Header, Body} from 'native-base'

import MapScreen from './src/components/map/map.component';
import AddPinMap from './src/components/addpinmap/addpinmap.component';
import PinInfo from './src/components/pininfo/pininfo.component';
import SearchScreen from './src/components/map/search.component';

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
})

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      location: null,
      errorMessage: null,
    }
  }

  async componentWillMount() {
    this._getLocationAsync();
    Auth.currentUserInfo().then(res => store.update({currentUser: res.username}));
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
    return <MyApp />;
  }
}

const RootStack = createStackNavigator(
  {
    Map: MapScreen,
    AddPin: AddPinMap,
    PinInfo: PinInfo,
    Search: SearchScreen
  },
);

const CustomDrawerContentComponent = (props) => (

  <Container>
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

  </Container>

);

const MyApp = createDrawerNavigator({
    Search: SearchScreen,
    Map: MapScreen,
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
  contentComponent: CustomDrawerContentComponent,
  contentOptions: {
    activeTintColor: 'red'
  }
}, {});

export default withAuthenticator(App /*, { includeGreetings: true }*/)

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
