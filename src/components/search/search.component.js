import React, { Component } from 'react';
import {ScrollView, AppRegistry, FlatList, StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, RefreshControl } from 'react-native';
import { Card, CardItem, Body, Container, Header, Content, Form, Icon, Item, Input, Button, Right, Left } from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import API, { graphqlOperation } from '@aws-amplify/api'
import MapView from 'react-native-maps';
import {store} from '../../../App'

var _mapView: MapView;

export default class SearchScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
        refreshing: false,
        searchText: ""
    }
  }

  static navigationOptions = {
    header: null,
  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
      Entypo: require("native-base/Fonts/Entypo.ttf"),
      FontAwesome: require("native-base/Fonts/FontAwesome.ttf"),
      MaterialCommunityIcons: require("native-base/Fonts/MaterialCommunityIcons.ttf"),
      // FontAwesome5: require("native-base/Fonts/FontAwesome5.tff")
    });
    this.setState({
      loading: false,
      markers: store.getState().markers,
     });
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.loadPins();
  }

  _getLocationAsync = async () => {
    let userLocation = {
      latitude: store.getState().latitude,
      longitude: store.getState().longitude
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
    this.setState({refreshing: false});
    console.log('All pins loaded!');
  }

  iconImage(marker){
    // console.log(marker.type);
    switch (marker.type) {
      case "Accident":{
      return <Icon  style={{color: '#eddd2d', position: 'absolute', right: 65,transform: [{scale: .75}]}} active type='FontAwesome' name='warning'/>;
      }
        break;
      case "Food":{
      return <Icon style={{color: '#f78640', position: 'absolute', right: 45,}} active type='MaterialCommunityIcons' name='food'/>;
      }
        break;
      case "Social":{
      return <Icon style={{color: '#ca30f4',position: 'absolute', right: 50, transform: [{scale: .75}]}} active type='FontAwesome' name='group'/>;
      }
        break;
      case "Study":{
      return <Icon style={{color: '#03a9f4',position: 'absolute', right: 45, transform: [{scale: .75}]}} active type='MaterialCommunityIcons' name='book-open-variant'/>;
      }
        break;
    }
  }

  handleSearch = (text) => {
  let newState = Object.assign({}, this.state);
  newState.searchText = text;
  this.setState(newState);
  };

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <ScrollView
        refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
      >
        <StatusBar hidden/>

        <Header searchBar rounded style = {{backgroundColor: '#03a9f4'}}>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search pins"
              onChangeText={ (search) => this.handleSearch(search)}
            />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>

        <Content padder>
          {this.state.markers.filter(
            marker => marker.name.toLowerCase()
            .includes(this.state.searchText.toLowerCase()))
            .map((marker, index) => (
              <Card
                key={marker.key}
              >
                <CardItem  button header bordered
                onPress={() => {
                  store.update({
                     region:{
                       latitude: marker.coordinate.latitude,
                       longitude: marker.coordinate.longitude,
                       latitudeDelta: store.state.region.latitudeDelta,
                       longitudeDelta: store.state.region.longitudeDelta
                        }
                    }
                  );
                  this.props.navigation.navigate('Map');
                }
              }>
                  <Icon style={{color: '#ed2224'}} active type='Entypo' name='location-pin' />
                  <Text style={{fontWeight: '300', fontSize: 15}}>{marker.name}</Text>
                  {this.iconImage(marker)}
                  <Text style={{position: 'absolute', right: 15, fontWeight: 'bold'}}>{marker.type}</Text>
                </CardItem>

                <CardItem  bordered>
                  <Icon active name='time' />
                  <Text style={{fontWeight: 'bold'}}>Start Time: </Text>
                  <Text>{marker.startTime}</Text>
                  <Text style={{fontWeight: 'bold', paddingLeft: 15}}>End Time: </Text>
                  <Text>{marker.endTime}</Text>
                </CardItem>

                <CardItem  bordered>
                  <Body>
                    <Text style={{fontWeight: 'bold'}}>Description: </Text>
                    <Text>{marker.description}</Text>
                  </Body>
                </CardItem>

                <CardItem  bordered>
                  <Icon active type='FontAwesome' name='user-o' />
                  <Text>{marker.placedBy}</Text>
                </CardItem>
              </Card>
          ))}
        </Content>
      </ScrollView>
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
