import React, { Component } from 'react';
import {ScrollView, AppRegistry, FlatList, StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Card, CardItem, Body, Container, Header, Content, Form, Icon, Item, Input, Button } from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import MapView from 'react-native-maps';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import API, { graphqlOperation } from '@aws-amplify/api'

export default class OurBar extends Component {
  constructor(props){
    super(props);


    
    this.state = {
        loading: true,
        markers: []
    
    }

  }
  

handleSearch = (text) => {
    console.log("text", text);
    this.setState({marker: text});
};

  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
    });
    this.setState({ 
      loading: false,
      markers: this.props.navigation.state.params.markers
     });
  }

  render() { 
      if (this.state.loading) {
    return <Expo.AppLoading />;
  }
    return (
<ScrollView>
      <StatusBar hidden/>
      <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input 
            placeholder="Search"
            onChangeText={ (search) => this.handleSearch(search)}/>
            <Icon name="ios-people" />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>
      <Content padder>
      {this.state.markers.map((marker, index) => (
        <Card
        key={marker.key}
        >
          <CardItem  header bordered>
          <Text>{marker.name}</Text>
          </CardItem>
          <CardItem  bordered>
          <Body>
            <Text>{marker.description}</Text>
            </Body>
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