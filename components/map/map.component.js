import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, StatusBar, Alert } from 'react-native';
import {Button} from 'react-native-elements';
import { Container, Header, Content, Text} from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import Expo, { Constants, Location, Permissions } from 'expo';
import { DrawerNavigator, DrawerItems } from 'react-navigation';


import styles from './map.component.style.js';
import myMapStyle from './mapstyle';

var _mapView: MapView;

const url = "https://okuncased2.execute-api.us-west-2.amazonaws.com/testing/addPin";

class Map extends Component {
  constructor(props){
    super(props);

    this.state = {
      x: {
        latitude: 36.812617,
        longitude: -119.745802,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0221,
      },
      region: {
        latitude: 36.812617,
        longitude: -119.745802,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0221,
      },
      loading: true,
    };

    this.testAPI.bind(this);
    this.getInitialState.bind(this);
    this._getLocationAsync.bind(this);
  }

  // Needed for Native-Base Buttons
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
    });
    this.setState({ loading: false });
  }

  testAPI(){
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'React Native Test',
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log('API Response: ');
      console.log(responseJson);
      return (Alert.alert('API Response', responseJson.body))
    })
    .catch((error) => {
      console.error('Error: ' + error);
    });
  }

  getInitialState() {
    return {
      latitude: 36.812617,
      longitude: -119.745802,
      latitudeDelta: 0.0422,
      longitudeDelta: 0.0221,
    };
  }

  _getLocationAsync = async () => {
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    let userLocation = {
      latitude: this.state.location.coords.latitude,
      longitude: this.state.location.coords.longitude,
    }
    console.log(JSON.stringify(userLocation));
    _mapView.animateToCoordinate(userLocation, 1000);
  };

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <View style ={styles.container}>
        <StatusBar hidden/>

        <MapView
          ref = {(mapView) => { _mapView = mapView; }}
          customMapStyle={myMapStyle}
          style={styles.map}
          onRegionChange={(region) => {this.setState({region}); console.log(region);}}
          initialRegion={this.getInitialState()}
        >
          <Marker draggable
            coordinate={this.state.x}
            onDragEnd={(e) => {this.setState({ x: e.nativeEvent.coordinate }); console.log('Marker location: ' + JSON.stringify(this.state.x.latitude) + ', ' + JSON.stringify(this.state.x.longitude));}}
          />
        </MapView>

        <View style={styles.buttonContainer}>
          <Button 
            raised
            backgroundColor='red'
            onPress={this.testAPI}
            title= 'Test API'
            >
          </Button>

          <Button 
             raise
             
             backgroundColor='red'
             onPress={this._getLocationAsync}
             title= 'Recenter on User'
            >
          </Button>
      
          <Button
            raised
            backgroundColor='red'
            title= 'MENU'
            >
          </Button>
        </View>

        <View style={[styles.bubble, styles.latlng, {bottom: 10}]}>
          <Text style={{ textAlign: 'center'}}
            onPress = {() => _mapView.animateToCoordinate(this.getInitialState(), 1000)}
            >
            {this.state.region.latitude.toPrecision(7)},
            {this.state.region.longitude.toPrecision(7)}
          </Text>
        </View>

      </View>
    );
  }
}

export default Map;
