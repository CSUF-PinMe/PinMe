import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, StatusBar, Alert, Platform, ScrollView, Image} from 'react-native';
import { Container, Header, Text, Content, Icon, Button, Left, Fab, Label} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Modal from "react-native-modalbox";
import ActionButton from 'react-native-action-button';
import { showLocation, Popup } from 'react-native-map-link';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import Expo, { Constants, Location, Permissions } from 'expo';
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import { StackActions, NavigationActions } from 'react-navigation';
import { TouchableHighlight } from 'react-native';

import API, { graphqlOperation } from '@aws-amplify/api'
import {Auth} from 'aws-amplify'
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
      currMarker: {},
      myMarkers: [],
      bottom: 1,
      loading: true,
      active: false,
      active1: false,
      margin_onClick: false,
    };

    this.getInitialState.bind(this);
    this._getLocationAsync.bind(this);
  }

  static navigationOptions = {
    header: null
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

  async componentDidMount(){
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
      Entypo: require("@expo/vector-icons/fonts/Entypo.ttf"),
      FontAwesome: require("native-base/Fonts/FontAwesome.ttf"),
    });
  }

  async componentWillMount(){
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

  deletePin = (id) => {
    const result = API.graphql(graphqlOperation(mutations.deletePin, {input: {id: id}}));
    console.log(result.data);
    var removeIndex = store.getState().markers.map(function(item) { return item.key; }).indexOf(id);
    store.update(s => {
      s.markers.splice(removeIndex, 1);
    })
    this.forceUpdate();
  }

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

  openModal = () => this.setState({ visible: true });
  closeModal = () => this.setState({ visible: false });

  // offUserLocation(){
  //   if(store.state.region.latitude === store.state.userLocation.latitude && store.state.region.longitude === store.state.userLocation.longitude){
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  iconImage () {
    switch (this.state.currMarker.type) {
      case "Accident":
        return <Icon  style={{color: '#03a9f4', fontSize: 50, left: 15}} active type="FontAwesome" name='warning'/>;
        break;
      case "Food":
        return <Icon style={{color: '#03a9f4', fontSize: 60, left: 15}} active type="Ionicons" name='ios-restaurant'/>;
        break;
      case "Social":
        return <Icon style={{color: '#03a9f4', fontSize: 60, left: 15}} active type="Ionicons" name='ios-people'/>;
        break;
      case "Study":
        return <Icon style={{color: '#03a9f4', fontSize: 40, left: 15}} active type="FontAwesome" name='book'/>;
        break;
      default:
        return <Image source={redPin} style={{transform: [{ scale: .30 }], marginLeft: 0}}/>;
        break;
    }
  }

  animateMapToMarker = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    var newRegion = {
      longitudeDelta: store.state.region.longitudeDelta,
      latitudeDelta: store.state.region.latitudeDelta,
      longitude: coordinate.longitude,
      latitude: coordinate.latitude
    } ;
    this._map.animateToRegion(newRegion, 300) ;
  };

  animateMapToUser = () => {
    var newRegion = {
      longitudeDelta: store.state.region.longitudeDelta,
      latitudeDelta: store.state.region.latitudeDelta,
      longitude: store.state.userLocation.longitude,
      latitude: store.state.userLocation.latitude
    }
    this.setState({offUserLocation: false});
    this._map.animateToRegion(newRegion, 300) ;
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
      <StatusBar hidden={Platform.OS === 'ios' ? false : true} />
      <View style={styles.mapContainer}>
        <MapView
          provider={this.props.provider}
          ref = {(ref)=>this._map=ref}
          customMapStyle={myMapStyle}
          style={[styles.mapContainer, {bottom: this.state.bottom}]}
          onPress={() => this.setState({ margin_onClick: false})}
          onRegionChange={(region) => {
            store.update({region});
          }}
          region={store.state.region}
          showsCompass={false}
          toolbarEnabled={true}
          loadingEnabled={true}
          showsUserLocation={true}
        >

        {store.state.markers.map((marker, index) => (
          <Marker
          margin_onClick={this.state.margin_onClick}
            key={marker.key}
            title={marker.name}
            description={marker.placedBy}
            coordinate={marker.coordinate}
            image={redPin}
            onCalloutPress={() => {
              // this.setState({isVisible: true});
              this.openModal();
            }} // change isVisible to modalMaker to allow modal
            onPress={e => {
              this.animateMapToMarker(e);
              this.mapLink(e.nativeEvent.coordinate, marker.name);
              this.setState({
                currMarker: marker,
                nameLength: marker.name.length,
                margin_onClick: true
              });
              this.toolbarHack();
              console.log(this.state);
            }}
          />
        ))}

        </MapView>

        <Icon style={{fontSize: 35, color: '#03a9f4', position: 'absolute', top: 60, right: 20}} onPress={() => this.animateMapToUser()} name="compass" type="Entypo" />

        <Popup
          isVisible={this.state.isVisible}
          onCancelPressed={() => this.setState({ isVisible: false })}
          onAppPressed={() => this.setState({ isVisible: false })}
          onBackButtonPressed={() => this.setState({ isVisible: false })}
          appsWhiteList={['uber', 'lyft', 'waze', 'google-maps', 'apple-maps']}
          options={{
            latitude: store.state.pinLink.latitude,
            longitude: store.state.pinLink.longitude,
            title: store.state.pinLink.name,
            dialogTitle: 'What app do you want to open?',
            cancelText: 'Cancel'
          }}
        />

        <Modal
          style={{ height: height*.70, width: width*.80, borderRadius: 10, borderColor: "white", borderWidth: 2,}}
          swipeToClose={true}
          swipeArea={20} // The height in pixels of the swipeable area, window height by default
          swipeThreshold={50} // The threshold to reach in pixels to close the modal
          isOpen={this.state.visible}
          onClosed={this.closeModal}
          backdropOpacity={0.3}
        >
            <Grid>
            <Row size={2} style={{alignItems: 'center'}}>
              {this.iconImage()}
              <Text numberOfLines={2} style={{marginLeft: 30, marginRight: 45, fontSize: 30, fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light'}}>
                {this.state.currMarker.name}
              </Text>
            </Row>
            <Col size={7}>
            <ScrollView scrollEnabled={true}>
              <Label style={{marginLeft: 10, fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light', fontSize: 20, fontWeight: '300'}}>Description</Label>
              <Text style={{marginLeft: 10, marginRight: 10, marginTop: 10, fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light'}}> {this.state.currMarker.description} </Text>
            </ScrollView>
            </Col>
              <Row size={1} style={{alignItems: 'center', justifyContent: 'space-between'}}>
                {this.state.currMarker.placedBy == store.state.currentUser ?
                  <Icon onPress={() => {
                    Alert.alert(
                      `Deleting Pin`,
                      `Are you sure you want to delete the pin '${this.state.currMarker.name}?'`,
                      [
                        {text: 'OK', onPress: () => {
                          this.deletePin(this.state.currMarker.key);
                          this.closeModal();
                        }},
                        {text: 'Cancel', onPress: () => {return}, style: 'cancel'},
                      ]
                    );
                  }}
                  style={{color: '#9e9e9e', left: 10}} name="trash-o" type="FontAwesome"/> :
                  <Label style={{left: 15, fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light'}}>{this.state.currMarker.placedBy} </Label>
                }
                <Icon style={{fontSize: 40, color: "#03a9f4", right: 10}} name="ios-navigate" type="Ionicons" onPress={() => {
                    this.closeModal();
                    setTimeout(() => {this.setState({isVisible: true});}, 400);
                  }}/>
              </Row>
            </Grid>
        </Modal>

        <View style = {styles.mapDrawerOverlay} />

        <View style={{ flex: 1, position: 'absolute'}}>
          <Fab
            active1={this.state.active1}
            containerStyle={{ }}
            style={{ backgroundColor: '#03a9f4' , top: Platform.OS === 'ios' ? 30 : 0}}
            position="topLeft"
            onPress={() => this.props.navigation.openDrawer()}>
            <Icon name="menu" />
          </Fab>
        </View>

        <ActionButton
        buttonColor="#03a9f4"
        backgroundTappable={true}
        fixNativeFeedbackRadius={true}
        offsetX={15}
        offsetY={15}
        >
          <ActionButton.Item size={40} buttonColor='white' title="Sign Out" onPress={() => {
            this.map.fitToCoordinates(MARKERS, {
                edgePadding: DEFAULT_PADDING,
                animated: true,
            });
            // Auth.signOut();
            // const resetAction = StackActions.reset({
            //   index: 0,
            //   actions: [
            //     NavigationActions.navigate({ routeName: 'SignIn' }),
            //   ],
            // });
            // this.props.navigation.dispatch(resetAction);
          }}>
            <Icon name="ios-arrow-back" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item size={40} buttonColor='white' title="Refresh Pins" onPress={() => {this.loadPins();}}>
            <Icon name="refresh" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item size={40} buttonColor='white' title="Create Pin" onPress={() => {this.props.navigation.navigate('AddPin')}}>
            <Icon name="create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    </Container>
    );
  }
}

MapScreen.propTypes = {
  provider: ProviderPropType,
}
