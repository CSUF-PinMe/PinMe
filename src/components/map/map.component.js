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
  Content, 
  Text, 
  Icon,
  Button,
  Left
} from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import Expo, { Constants, Location, Permissions } from 'expo';
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import API, { graphqlOperation } from '@aws-amplify/api'
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import styles from './map.component.style.js';
import myMapStyle from './mapstyle';

var _mapView: MapView;

const pinDetails = {
  userId: "321",
  eventName: "Test Pin",
  eventType: "Test Type",
  timeStamp: "Sat 2:23PM",
  startTime: "Sat 2:25PM",
  endTime: "Sat 2:30PM",
  description: "This is a test pin description",
  latitude: "36.81261365334545",
  longitude: "-119.74580140784383"
}

class MapScreen extends Component {
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

  // Adds new pin with info in pinDetails
  testAddPin = async () => {
    const newPin = API.graphql(graphqlOperation(mutations.createPin, {input: pinDetails}));
    console.log(newPin);
    Alert.alert('PinMe', "Pin successfully added!");
  }

  // Queries and returns all entries
  testGetPin = async () => {
    const allPins = await API.graphql(graphqlOperation(queries.listPins));
    console.log(allPins);
  }

  // Queries for entry with matching id
  testGetOnePin = async () => {
    const onePin = await API.graphql(graphqlOperation(queries.getPin, { id: '30e700b4-31bb-48e3-a9e7-ab4b30e81f73' }));
    console.log(onePin);
  }
  
  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
        <StatusBar hidden/>
          <Header>
          <View style={{ width: Dimensions.get('window').width * 0.9 }}>
              <Icon name="ios-menu" onPress={
                ()=>
                this.props.navigation.openDrawer()}/>
            </View>
          </Header>
          <Content contentContainerSyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          </Content>
      <View style={styles.Mapcontainer}>
        <MapView
          ref = {(mapView) => { _mapView = mapView; }}
          customMapStyle={myMapStyle}
          style={styles.mapContainer}
          onRegionChange={(region) => {this.setState({region}); console.log(region);}}
          initialRegion={this.getInitialState()}
        >
          <Marker draggable
            coordinate={this.state.x}
            onDragEnd={(e) => {this.setState({ x: e.nativeEvent.coordinate }); console.log('Marker location: ' + JSON.stringify(this.state.x.latitude) + ', ' + JSON.stringify(this.state.x.longitude));}}
          />
      
        </MapView>
        <View style={styles.mapDrawerOverlay} />
        <View style={styles.buttonContainer} />

          <Button 
            raised
            backgroundColor='red'
            onPress={this.testAPI}
            title= 'Test API'
            >
          </Button>

          <Button 
             raised
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
        </Container>
    );
  }
}

export default MapScreen;
