import React, { Component } from 'react';
import {Image, ScrollView, AppRegistry, FlatList, StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Card, CardItem, Body, Container, Header, Content, Form, Icon, Item, Input, Button, Right, Left } from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import MapView from 'react-native-maps';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import API, { graphqlOperation } from '@aws-amplify/api'
import {store} from '../../../App'

export default class MyPinsScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
        searchText: ""
    }
  }

  static navigationOptions = {
    header: null
  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
      Entypo: require("native-base/Fonts/Entypo.ttf"),
      FontAwesome: require("native-base/Fonts/FontAwesome.ttf"),
      MaterialCommunityIcons: require("native-base/Fonts/MaterialCommunityIcons.ttf"),
    });
    this.setState({
      loading: false
     });
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

  static navigationOptions = {
    header: null,
    tabBarHidden: true,
  }

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
          {store.state.markers.filter(marker => marker.placedBy === store.state.currentUser)
            .filter(marker => marker.name.toLowerCase()
            .includes(this.state.searchText.toLowerCase())).map((marker, index) => (
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
                }});
                this.props.navigation.navigate('Map');
                }}>
                  <Icon active type='Entypo' name='location-pin' />
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
                  <Icon style={{position: 'absolute', right: 0 }} type='Ionicons' name='trash' onPress={() => {this.deletePin(marker.key); console.log('Deleting pin: ', marker.name);}}/>
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
    flex: 1,
  },
});
