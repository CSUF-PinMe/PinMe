import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Container, Header, Title, Content, Form, Item, Input, Button, Label, Icon, Left, Body, Right, Picker, Textarea} from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import API, { graphqlOperation } from '@aws-amplify/api';
import { Auth } from 'aws-amplify';
import * as mutations from '../../graphql/mutations';
import Font from 'expo';
import MapView from 'react-native-maps';

const currentUser = '';

export default class PinInfo extends Component {
  constructor(props){
    super(props);

    const { navigation } = this.props;

    this.state = {
        loading: true,
        pinInfo: {
          userId: currentUser,
          eventName: '',
          eventType: undefined,
          description: '',
          startTime: '',
          endTime: '',
          latitude: navigation.getParam('region').latitude,
          longitude: navigation.getParam('region').longitude
        }
    };

    this.handleChange.bind(this);
  }

  static navigationOptions = {
    header: null
  }

  // Needed for Native-Base Buttons
  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    Auth.currentUserInfo().then(res => currentUser = res.username);
    this.setState({ loading: false });
  }

  handleChange(name, value){
    this.setState({
      pinInfo: {
        ...this.state.pinInfo,
        [name]: value
      }
    });
  }

  handleDropdown(value: string) {
    this.setState({
      pinInfo: {
        ...this.state.pinInfo,
        eventType: value
      }
    });
  }

  addPin() {

    const newPin = API.graphql(graphqlOperation(mutations.createPin,
      {
        input: this.state.pinInfo
      }
    ));

    this.props.navigation.state.params.refreshMap();
    this.props.navigation.navigate('MainMap');
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
              <Input
                onChangeText={(e) => this.handleChange('eventName', e)}
                value={this.state.pinInfo.eventName}
                />
            </Item>

            <Item stackedLabel>
              <Label>Event Type </Label>
              <Item picker >
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="ios-arrow-down-outline" />}
                  style={{ width: undefined }}
                  placeholder="Select the type of event"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.pinInfo.eventType}
                  onValueChange={this.handleDropdown.bind(this)}
                >
                  <Picker.Item label=""  />
                  <Picker.Item label="Accident" value="Accident" />
                  <Picker.Item label="Food" value="Food" />
                  <Picker.Item label="Social" value="Social" />
                  <Picker.Item label="Study" value="Study" />
                </Picker>
              </Item>
            </Item>

            <Item stackedLabel>
              <Label>Description </Label>
              <Input
                onChangeText={(e) => this.handleChange('description', e)}
                value={this.state.pinInfo.description}
              />
            </Item>

            <Item stackedLabel>
            <Label>Start Time</Label>
              <Item>
                <Icon active name='time' />
                <Input
                  placeholder='e.g. 11:30 AM'
                  placeholderTextColor = '#9e9e9e'
                  onChangeText={(e) => this.handleChange('startTime', e)}
                  value={this.state.pinInfo.startTime}
                  />
              </Item>
            </Item>

            <Item stackedLabel>
              <Label>End Time</Label>
              <Item>
                <Icon active name='time' />
                <Input
                placeholder='e.g. 2:00 PM'
                placeholderTextColor = '#9e9e9e'
                onChangeText={(e) => this.handleChange('endTime', e)}
                value={this.state.pinInfo.endTime}
                />
              </Item>
            </Item>

            <Button block style = {{top: 10, height: 60, backgroundColor: '#FFFFFF'}} onPress={() => this.props.navigation.goBack()}>
              <Text style = {{color: '#000000'}}>Change Location</Text>
            </Button>

          </Form>

          <Content>
            <Button block style = {{top: 20, height: 60, backgroundColor: '#79e56a'}} onPress={() => this.addPin()}>
              <Text style = {{color: '#FFFFFF'}}>Create Pin</Text>
            </Button>
            <Button block style = {{top: 30, height: 60, backgroundColor: '#9e9e9e'}} onPress={() => {this.props.navigation.navigate('MainMap')}}>
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
