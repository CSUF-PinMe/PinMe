import React from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import { fadeIn, zoomIn } from 'react-navigation-transitions';

import MapScreen from './src/components/map/map.component';
import AddPinMap from './src/components/addpinmap/addpinmap.component';
import PinInfo from './src/components/pininfo/pininfo.component';

import Expo, { Constants, Location, Permissions } from 'expo';
import { withAuthenticator } from 'aws-amplify-react-native'
import Amplify from '@aws-amplify/core'
import config from './aws-exports'
import OurBar from './src/components/map/search.component';
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
    return <RootStack />;
  }
}

const RootStack = createStackNavigator(
  {
    MainMap: MapScreen,
    AddPin: AddPinMap,
    PinInfo: PinInfo,
    OurBar: OurBar
  },
  {
    initialRouteName: 'MainMap',
    transitionConfig: () => fadeIn(),
  }
);

export default withAuthenticator(App)
