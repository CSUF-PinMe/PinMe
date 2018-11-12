import React, { Component } from 'react';
import { 
  View,
  StyleSheet, 
  Text,
  ScrollView,
  Image,
 } from 'react-native'
import Expo, { 
  Constants, 
  Location, 
  Permissions 
} from 'expo'
import {
  createDrawerNavigator,
  createStackNavigator,
  DrawerItems, 
  SafeAreaView
} from 'react-navigation'
import {
  Container, 
  Content, 
  Icon, 
  Header, 
  Body
} from 'native-base'
import MapView from 'react-native-maps'
import { withAuthenticator } from 'aws-amplify-react-native'
import Amplify from '@aws-amplify/core'
import config from './aws-exports'
import SettingsScreen from './src/components/menu/SettingsScreen'
import ProfileScreen from './src/components/menu/ProfileScreen'
import SearchScreen from './src/components/menu/SearchScreen'
import { FormValidationMessage } from 'react-native-elements';
import MapScreen from './src/components/map/map.component'
import AddPinMap from './src/components/addpinmap/addpinmap.component';
import FormPage from './src/components/pin_info/form_page.component';
//import { fadeIn, zoomIn } from 'react-navigation-transitions';
import { Route53Domains } from 'aws-sdk/clients/all';
import mapComponentStyle from './src/components/map/map.component.style';

Amplify.configure(config)

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
    return (
      <MyApp/>
);
}
}

const RootStack = createStackNavigator(
  {
    // Login: LoginScreen,
    AddPin: AddPinMap,
    PinInfo: FormPage
  },
  {
  //  transitionConfig: () => fadeIn(),
  }
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
    Profile: ProfileScreen,
    Search:  SearchScreen,
    Settings: SettingsScreen,
    Map: MapScreen,
    AddPin:{
      screen: AddPinMap,
      navigationOptions: {
        drawerLabel: ()=>null
      }
    },
    PinInfo: {
      screen: FormPage,
      navigationOptions: {
        drawerLabel: ()=>null
      }
    }
},
{
  initialRouteName: 'Map',
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
