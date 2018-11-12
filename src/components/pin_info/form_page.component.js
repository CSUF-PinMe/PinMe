import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Container, Header, Title, Content, Form, Item, Input, Button, Label, Icon, Left, Body, Right, Picker, Textarea} from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import Font from 'expo';
import MapView from 'react-native-maps';

export default class FormPage extends Component {
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
        <Header style = {{backgroundColor: '#03a9f4', height: 65}}>
        <View style = {{top: 20}}>
          <Body>
            <Title>Pin Information</Title>
          </Body>
        </View>

        </Header>

        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Event Name </Label>
              <Input />
            </Item>

            <Item stackedLabel>
              <Label>Event Type </Label>
            <Item picker >
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                style={{ width: undefined }}
                placeholder="Event Type"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selected2}
                onValueChange={this.onValueChange2.bind(this)}
              >
                <Picker.Item label="  " value="key0" />
                <Picker.Item label="Accident" value="key1" />
                <Picker.Item label="Food" value="key2" />
                <Picker.Item label="Social" value="key3" />
                <Picker.Item label="Study" value="key4" />
              </Picker>
            </Item>
            </Item>

            <Item stackedLabel>
              <Label>Description </Label>
              <Input />
            </Item> 

            <Item stackedLabel>
            <Label>Start Time</Label>
            <Item>
            <Icon active name='time' />
            <Input placeholder='e.g. 11:30 AM' placeholderTextColor = '#9e9e9e'/>
            </Item>
            </Item>

            <Item stackedLabel>
            <Label>End Time</Label>
            <Item>
            <Icon active name='time' />
            <Input placeholder='e.g. 2:00 PM' placeholderTextColor = '#9e9e9e'/>
            </Item>
            </Item>

            <Button block style = {{top: 10, height: 60, backgroundColor: '#FFFFFF'}}>
              <Text style = {{color: '#000000'}}>Change Location</Text>
            </Button>

          </Form>

          <Content>
            <Button block style = {{top: 20, height: 60, backgroundColor: '#79e56a'}}>
              <Text style = {{color: '#FFFFFF'}}>Create Pin</Text>
            </Button>
            <Button block style = {{top: 30, height: 60, backgroundColor: '#9e9e9e'}}>
              <Text style = {{color: '#FFFFFF'}}>Cancel</Text>
            </Button>
            <Button disabled style = {{top: 40, height: 60, backgroundColor: '#FFFFFF'}}>
            </Button>
          </Content>

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