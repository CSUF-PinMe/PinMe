/* @flow */

// TO-DO
//  * Implement MobX state management
import styles from './addpinmap.component.style.js';
import myMapStyle from '../map/mapstyle';
import { Container, Header, Content, Button, Text, Icon as NativeIcon, Footer} from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import MapView, { Marker } from 'react-native-maps';
import API, { graphqlOperation } from '@aws-amplify/api'
import { createDrawerNavigator } from 'react-navigation';
import * as mutations from '../../graphql/mutations';
import redPin from '../../../assets/pin_red.png'
import grayPin from '../../../assets/pin_gray.png'
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image
} from 'react-native';

let id = 0;
var {height, width} = Dimensions.get('window');

const initialRegion = {
  latitude: 36.812617,
  longitude: -119.745802,
  latitudeDelta: 0.0422,
  longitudeDelta: 0.0221,
}

const pin = {
  userId: '123',
  eventName: 'new pin',
  eventType: 'type',
  description: 'my description',
  latitude: 36.812617,
  longitude: -119.745802
}

export default class AddPinMap extends Component {
  constructor(props){
    super(props);
    const { navigation } = this.props;

    this.state ={
      region: navigation.getParam('region', initialRegion),
      markers: navigation.getParam('markers', pin),
      color: 'navy',
      loading: true,
    };
  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
      FontAwesome: require('react-native-vector-icons/Fonts/FontAwesome.ttf'),
      Entypo: require('react-native-vector-icons/Fonts/Entypo.ttf'),
    });
    this.setState({ loading: false });
  }

  static navigationOptions = {
    header: null
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <View style={styles.container}>
          <StatusBar hidden/>
          <View style={styles.container}>
            <MapView
            style={styles.map}
            onRegionChange={(region) => this.setState({region})}
            initialRegion={this.state.region}
            customMapStyle={myMapStyle}
            >
            {this.state.markers.map((marker, index) => (
              <Marker
                key={marker.key}
                coordinate={marker.coordinate}
                image={grayPin}
              />
            ))}
            </MapView>
          </View>

          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 40, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={redPin} style={{transform: [{ scale: .35 }]}}/>
          </View>

          <View style={styles.button1Container}>
            <Button large rounded danger
            onPress={() => this.props.navigation.goBack()}
            >
              <NativeIcon type="FontAwesome" name="chevron-circle-left" />
            </Button>
          </View>
          <View style={styles.button2Container}>
            <Button large rounded success
              onPress={() => this.props.navigation.navigate('PinInfo',
              {
                'region': this.state.region,
                refreshMap: this.props.navigation.state.params.refresh
                })}
            >
              <NativeIcon type="FontAwesome" name="check-circle" />
            </Button>
          </View>


      </View>
    );
  }
}
