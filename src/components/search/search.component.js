import React, { Component } from 'react';
import {ScrollView, AppRegistry, FlatList, StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Card, CardItem, Body, Container, Header, Content, Form, Icon, Item, Input, Button, Right, Left } from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import MapView from 'react-native-maps';
import {store} from '../../../App'

var _mapView: MapView;

export default class SearchScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
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

  _getLocationAsync = async () => {
    let userLocation = {
      latitude: store.getState().latitude,
      longitude: store.getState().longitude
    }
    console.log(JSON.stringify(userLocation));
    _mapView.animateToCoordinate(userLocation, 1000);
  };

  iconImage (marker) {
    console.log(marker.type);
    switch (marker.type) {
      case "Accident":{
      return <Icon  style={{position: 'absolute', right: 65,transform: [{scale: .75}]}} active type='FontAwesome' name='warning'/>; 
      }
        break;
      case "Food":{
      return <Icon style={{position: 'absolute', right: 45,}} active type='MaterialCommunityIcons' name='food'/>;
      }
        break;
      case "Social":{
      return <Icon style={{position: 'absolute', right: 50, transform: [{scale: .75}]}} active type='FontAwesome' name='group'/>; 
      }
        break;
      case "Study":{
      return <Icon style={{position: 'absolute', right: 45, transform: [{scale: .75}]}} active type='MaterialCommunityIcons' name='book-open-variant'/>; 
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
      <ScrollView>
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
                  <Icon 
                  active type='Entypo' name='location-pin' />
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
