import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    ScrollView,
 } from 'react-native';
import {
        Container,
        Header,
        Content,
        Text,
        Icon,
        Button,
        Left,
        Card,
        CardItem,
        Body,
        Item,
        Input
} from 'native-base';

export default class SearchScreen extends Component {

  static navigationOptions = {
    drawerIcon: ({tintColor}) => (
      <Icon name = "search" style = {{fontSize: 24, color:tintColor}} />
    )
  }
  render() {
    return (
      <ScrollView>
      <StatusBar hidden/>
      <Header searchBar rounded style = {{backgroundColor: '#03a9f4'}}>
          <Item>
            <Icon name="ios-search" />
            <Input
            placeholder="Search"/>
            <Icon name="ios-people" />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>
      <Content padder>
        <Card>
          <CardItem header bordered >
            <Text>NativeBase</Text>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Text>
                PinMe!
              </Text>
            </Body>
          </CardItem>
          <CardItem footer bordered>
            <Text>GeekyAnts</Text>
          </CardItem>
        </Card>
      </Content>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20
  }
});
