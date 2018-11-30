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
import { showLocation, Popup } from 'react-native-map-link';
import MapView, { Marker } from 'react-native-maps';
import Expo, { Constants, Location, Permissions } from 'expo';
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import Modal from "react-native-modal";
import API, { graphqlOperation } from '@aws-amplify/api'
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import styles from './map.component.style.js';
import myMapStyle from './mapstyle';
import * as Animatable from 'react-native-animatable';
import redPin from '../../../assets/pin_red.png'
import {store} from '../../../App'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

var _mapView: MapView;

export default class MapScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isVisible: false,
      bottom: 1,
      loading: true,
      active: false,
      active1: false,
      margin_onClick: false,
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
      latitude: store.state.region.latitude,
      longitude: store.state.region.longitude,
      latitudeDelta: store.state.region.latitudeDelta,
      longitudeDelta: store.state.region.longitudeDelta,
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

  // deletePin = async (e) => {
  //   var removeIndex = this.state.markers.map(function(item) { return item.key; }).indexOf(e);
  //   this.state.markers.splice(removeIndex, 1);
  //   const result = API.graphql(graphqlOperation(mutations.deletePin, {input: {id: e}}));
  // }

  // Queries and returns all entries
  // getAllPins = async () => {
  //   const allPins = await API.graphql(graphqlOperation(queries.listPins, {limit: 100}));
  //   console.log(allPins);
  // }

  loadPins = async () => {
    store.update({markers: []});
    const allPins = await API.graphql(graphqlOperation(queries.listPins, {limit: 100}));
    allPins.data.listPins.items.map(pin => (
      // console.log()
      store.update({
        markers: [
          ...store.state.markers,
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
    this.setState({loading: false});
    console.log('All pins loaded!');
  }

  // Queries for entry with matching id
  // getOnePin = async () => {
  //   const onePin = await API.graphql(graphqlOperation(queries.getPin, { id: '30e700b4-31bb-48e3-a9e7-ab4b30e81f73' }));
  //   console.log(onePin);
  // }

  static navigationOptions = {
    header: null,
    tabBarHidden: true,
  }

  toolbarHack = () => {
    if(this.state.bottom === 1){
      this.setState({bottom: 0})
    }
  }

  mapLink = (coords, name) => {
    store.update({pinLink: {
      name: name,
      latitude: coords.latitude,
      longitude: coords.longitude
    }})
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    if (this.state.margin_onClick === true) {
      margin_gap = 60;
    } else {
      margin_gap = 0;
    }
    return (
    <Container style={styles.mapContainer}>
        <StatusBar hidden/>
      <View style={styles.mapContainer}>
        <MapView
          // provider={PROVIDER_GOOGLE}
          ref = {(mapView) => { _mapView = mapView; }}
          customMapStyle={myMapStyle}
          style={[styles.mapContainer, {bottom: this.state.bottom}]}
          onPress={() => this.setState({ margin_onClick: false})}
          onRegionChange={(region) => store.update({region})}
          initialRegion={store.state.region}
          toolbarEnabled={true}
        >

        {store.state.markers.map((marker, index) => (
          <Marker
          margin_onClick={this.state.margin_onClick}
            key={marker.key}
            title={marker.name}
            description={marker.description}
            coordinate={marker.coordinate}
            image={redPin}
            onCalloutPress={() => this.setState({isVisible: true})}
            onPress={e => {
              this.mapLink(e.nativeEvent.coordinate, marker.name);
              this.setState({margin_onClick: true});
              this.toolbarHack();
              
            }}
          />
        ))}
        </MapView>


        <Popup
          isVisible={this.state.isVisible}
          onCancelPressed={() => this.setState({ isVisible: false })}
          onAppPressed={() => this.setState({ isVisible: false })}
          onBackButtonPressed={() => this.setState({ isVisible: false })}
          appsWhiteList={['uber', 'lyft', 'waze']}
          options={{
            latitude: store.state.pinLink.latitude,
            longitude: store.state.pinLink.longitude,
            title: store.state.pinLink.name,
            dialogTitle: 'What app do you want to open?',
            cancelText: 'Cancel'
          }}
        />

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
            containerStyle={{ marginBottom: margin_gap}}
            style={{ backgroundColor: '#03a9f4' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="add" />
            <Button style={{ backgroundColor: '#03a9f4' }}
              onPress={() => this.props.navigation.navigate('AddPin')}>
              <Icon name="pin" />
            </Button>
            <Button style={{ backgroundColor: '#FFFFFF'}}
              onPress={this._getLocationAsync}
              >
              <Icon style = {{color: '#03a9f4'}} name="locate"/>
            </Button>
            <Button style={{ backgroundColor: '#FFFFFF'}}
              onPress={this.loadPins}
              >
              <Icon style = {{color: '#03a9f4'}} name="refresh"/>
            </Button>

          </Fab>
          </View>
        </View>
    </Container>
    );
  }
}
