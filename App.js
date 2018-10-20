import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import Expo, { Constants, Location, Permissions } from 'expo';
import MapView from 'react-native-maps';
import Map from './components/map/map.component';

export default class App extends Component {
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
      <Map location={this.state.location}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
});
