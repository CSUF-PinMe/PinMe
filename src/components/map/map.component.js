import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import {
  Container,
  Header,
  Text,
  Content,
  Icon,
  Button,
  Left,
  Fab
} from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import Expo, { Constants, Location, Permissions } from 'expo';
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import API, { graphqlOperation } from '@aws-amplify/api'
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import styles from './map.component.style.js';
import myMapStyle from './mapstyle';
import redPin from '../../../assets/pin_red.png'
import {store} from '../../../App'


let id = 0;
var _mapView: MapView;
var myTimestamp = new Date();

const initialMarkers = [];

export default class MapScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      region: {
        latitude: store.getState().latitude,
        longitude: store.getState().longitude,
        latitudeDelta: store.getState().latitudeDelta,
        longitudeDelta: store.getState().longitudeDelta,
      },
      loading: true,
      markers: initialMarkers,
      active: false,
      active1: false
    };

    this.getInitialState.bind(this);
    this._getLocationAsync.bind(this);
  }

  // For button components on map

  onValueChange(value: string) {
    this.setState({
      selected: value
    });
  }
  onValueChange2(value: string) {
    this.setState({
      selected2: value
    });
}

  // Needed for Native-Base Buttons
  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
    });
    this.loadPins();
  }

  getInitialState() {
    return {
      latitude: store.getState().latitude,
      longitude: store.getState().longitude,
      latitudeDelta: store.getState().latitudeDelta,
      longitudeDelta: store.getState().longitudeDelta,
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

  // Adds new pin with info in pinDetails
  // addPin = async () => {
  //   const newPin = API.graphql(graphqlOperation(mutations.createPin, {input: pinDetails}));
  //   // console.log(newPin);
  //   Alert.alert('PinMe', "Pin successfully added!");
  // }

  deletePin = async (e) => {
    var removeIndex = this.state.markers.map(function(item) { return item.key; }).indexOf(e);
    this.state.markers.splice(removeIndex, 1);
    const result = API.graphql(graphqlOperation(mutations.deletePin, {input: {id: e}}));
  }

  // Queries and returns all entries
  getAllPins = async () => {
    const allPins = await API.graphql(graphqlOperation(queries.listPins, {limit: 100}));
    console.log(allPins);
  }

  loadPins = async () => {
    this.setState({markers: []});
    const allPins = await API.graphql(graphqlOperation(queries.listPins, {limit: 100}));
    allPins.data.listPins.items.map(pin => (
      // console.log()
      this.setState({
        markers: [
          ...this.state.markers,
          {
            name: pin.eventName,
            description: pin.description,
            key: pin.id,
            placedBy: pin.userId,
            type: pin.eventType,
            startTime: pin.startTime,
            endTime: pin.endTime,
            coordinate: {
              latitude: Number(pin.latitude),
              longitude: Number(pin.longitude)
            },
          }
        ]
      })
    ))
    store.update({markers: this.state.markers})
    this.setState({loading: false});
    console.log('All pins loaded!');
  }

  // Queries for entry with matching id
  getOnePin = async () => {
    const onePin = await API.graphql(graphqlOperation(queries.getPin, { id: '30e700b4-31bb-48e3-a9e7-ab4b30e81f73' }));
    console.log(onePin);
  }

  static navigationOptions = {
    header: null,
    tabBarHidden: true
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
    <Container style={styles.MapContainer}>
        <StatusBar hidden/>
      <View style={styles.Mapcontainer}>
        <MapView
          // provider={PROVIDER_GOOGLE}
          ref = {(mapView) => { _mapView = mapView; }}
          customMapStyle={myMapStyle}
          style={styles.mapContainer}
          onRegionChange={(region) => {this.setState({region}); console.log(region);}}
          initialRegion={this.getInitialState()}
        >

        {this.state.markers.map((marker, index) => (
          <Marker
            key={marker.key}
            title={marker.name}
            description={marker.description}
            coordinate={marker.coordinate}
            image={redPin}
          />
        ))}

        </MapView>
        <View style = {styles.mapDrawerOverlay} />

        <View style={{ flex: 1, position: 'absolute'}}>
          <Fab
            active1={this.state.active1}
            direction="right"
            containerStyle={{ }}
            style={{ backgroundColor: '#03a9f4' }}
            position="topLeft"
            onPress={() => this.props.navigation.openDrawer()}>
            <Icon name="menu" />
          </Fab>
        </View>

        <View style={{ flex: 1}}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#03a9f4' }}
            position="bottomLeft"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="add" />
            <Button style={{ backgroundColor: '#03a9f4' }}
              onPress={() => this.props.navigation.navigate('AddPin',
              {
              'region': this.state.region,
              'markers': this.state.markers,
              refresh: this.loadPins
              })}
            >
              <Icon name="pin" />
            </Button>
            <Button style={{ backgroundColor: '#FFFFFF'}}
              onPress={this._getLocationAsync}
              >
              <Icon style = {{color: '#03a9f4'}} name="locate"/>
            </Button>
          </Fab>
          </View>
        </View>
    </Container>
    );
  }
}
