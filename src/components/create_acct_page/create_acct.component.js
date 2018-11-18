import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Card, CardItem, Thumbnail, Image, Container, Header, Segment, Title, Content, Form, Item, Input, Button, Label, Icon, Left, Body, Right, Picker, Textarea} from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import Font from 'expo';
import MapView from 'react-native-maps';

export default class CreateAcct extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
        selected: undefined,
        selected2: undefined
    };
  }
  onValueChange(value: string) {
    this.setState({
      selected: value
    });
  } 
    this.setState({
      selected2: value
    });
  }

  // Needed for Native-Base Buttons
  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
        <StatusBar hidden/>
        <Content >
        <Header style = {{backgroundColor: '#03a9f4', height: 65}}>
        <View style = {{top: 20}}>
          <Body>
            <Title>Create PinMe Account </Title>
          </Body>
        </View>
        </Header>

          <Form>
            <Item floatingLabel >
              <Label>Username</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Email Address</Label>
              <Input />
            </Item>
            <Item stackedLabel last>
              <Label>Phone Number</Label>
              <Input placeholder= "(e.g.) +12223334444" placeholderTextColor = '#9e9e9e'/>
            </Item>
          </Form>

            <Button block style = {{top: 20, height: 60, backgroundColor: '#79e56a'}}>
              <Text style = {{color: '#FFFFFF'}}>Sign Up</Text>
            </Button>
            <Button block style = {{top: 30, height: 60, backgroundColor: '#9e9e9e'}}>
              <Text style = {{color: '#FFFFFF'}}>Returning User? Sign In</Text>
            </Button>
            <Button disabled style = {{top: 40, height: 60, backgroundColor: '#FFFFFF'}}>
            </Button>
          </Content>
      </Container>
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