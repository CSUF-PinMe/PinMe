import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, Alert, Platform } from 'react-native';
import { Container, Header, Title, Content, Form, Item, Input, Button, Label, Icon, Left, Body, Right, Picker, Textarea} from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import Font from 'expo';
import MapView from 'react-native-maps';
import {store} from '../../../App'
import { Auth } from 'aws-amplify'

export default class PinInfo extends Component {
  constructor(props){
    super(props);

    this.state = {
      amountEmpty: 0,
      loading: true,
      pinInfo: {
        userId: store.state.currentUser,
        eventName: store.state.pinInfo.eventName,
        eventType: store.state.pinInfo.eventType,
        description: store.state.pinInfo.description,
        startTime: store.state.pinInfo.startTime,
        endTime: store.state.pinInfo.endTime,
        latitude: store.state.region.latitude,
        longitude: store.state.region.longitude
      }
    };
    this.handleChange.bind(this);
  }

  static navigationOptions = {
    header: null
  }

  // Needed for Native-Base Buttons
  async componentDidMount() {
    store.update({
      pinInfo: {
        ...store.state.pinInfo,
        latitude: this.state.pinInfo.latitude,
        longitude: this.state.pinInfo.longitude
      }
    });
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ loading: false });
  }

  handleChange(name, value){
    // console.log(name, ' is now ', value);
    this.setState({
      pinInfo: {
        ...this.state.pinInfo,
        [name]: value
      }
    });
    store.update({
      pinInfo: {
        ...store.state.pinInfo,
        [name]: value
      }
    });
  }

  handleDropdown(value: string) {
    if(value.trim() !== "") {this.setState(() => ({ typeError: null }));}
    this.setState({
      pinInfo: {
        ...this.state.pinInfo,
        eventType: value
      }
    });
    store.update({
      pinInfo: {
        ...store.state.pinInfo,
        eventType: value
      }
    });
  }

  checkInput(){
    let error = false;
    if (store.state.pinInfo.eventName.trim() === "") {
      this.setState(() => ({ nameError: "Pin name required." }));
      error = true;
    } else {
      this.setState(() => ({ nameError: null }));
    }

    if (store.state.pinInfo.description.trim() === "") {
      this.setState(() => ({ descError: "Description required." }));
      error = true;
    } else {
      this.setState(() => ({ descError: null }));
    }

    if (store.state.pinInfo.startTime.trim() === "") {
      this.setState(() => ({ sTimeError: "Start time required." }));
      error = true;
    } else {
      this.setState(() => ({ sTimeError: null }));
    }
    if (store.state.pinInfo.endTime.trim() === "") {
      this.setState(() => ({ eTimeError: "End time required." }));
      error = true;
    } else {
      this.setState(() => ({ eTimeError: null }));
    }
    if(error){
      return false;
    } else {
      return true;
    }
  }

  addPin() {
    // console.log('Local State', this.state.pinInfo);
    console.log('Global State', store.state.pinInfo);

    if(this.checkInput() === false){
      console.log('something is empty');
    } else {
      console.log('no empty fields!');
      const newPin = API.graphql(graphqlOperation(mutations.createPin,
        {
          input: store.state.pinInfo
        }
      ));
      this.props.navigation.navigate('Map');
    }
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
      <StatusBar hidden={Platform.OS === 'ios' ? false : true} />
      <Header />
        <Content>
          <Form>

            <Item stackedLabel>
              <Label>Event Name </Label>
              <Input
              onChangeText={(e) => {
                this.handleChange('eventName', e);
                if(e.trim() !== "") {this.setState(() => ({ nameError: null }));}
                this.handleChange('userId',store.state.currentUser);
              }}
              value={store.state.pinInfo.eventName}
                />
            </Item>
            {!!this.state.nameError && (
              <Text style={{ color: "red", left: 15 }}>{this.state.nameError}</Text>
            )}

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
                  selectedValue={store.state.pinInfo.eventType}
                  onValueChange={this.handleDropdown.bind(this)}
                >
                  <Picker.Item label="General"  value="General"/>
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
                onChangeText={(e) => {
                  this.handleChange('description', e);
                  if(e.trim() !== "") {this.setState(() => ({ descError: null }));}
                }}
                value={store.state.pinInfo.description}
              />
            </Item>
            {!!this.state.descError && (
              <Text style={{ color: "red", left: 15 }}>{this.state.descError}</Text>
            )}

            <Item stackedLabel>
            <Label>Start Time</Label>
              <Item>
                <Icon active name='time' />
                <Input
                  placeholder='e.g. 11:30 AM'
                  placeholderTextColor = '#9e9e9e'
                  onChangeText={(e) => {
                    this.handleChange('startTime', e);
                    if(e.trim() !== "") {this.setState(() => ({ sTimeError: null }));}
                  }}
                  value={store.state.pinInfo.startTime}
                  />
              </Item>
            </Item>
            {!!this.state.sTimeError && (
              <Text style={{ color: "red", left: 15 }}>{this.state.sTimeError}</Text>
            )}

            <Item stackedLabel>
              <Label>End Time</Label>
              <Item>
                <Icon active name='time' />
                <Input
                placeholder='e.g. 2:00 PM'
                placeholderTextColor = '#9e9e9e'
                onChangeText={(e) => {
                  this.handleChange('endTime', e);
                  if(e.trim() !== "") {this.setState(() => ({ eTimeError: null }));}
                }}
                value={store.state.pinInfo.endTime}
                />
              </Item>
            </Item>
            {!!this.state.eTimeError && (
              <Text style={{ color: "red", left: 15 }}>{this.state.eTimeError}</Text>
            )}

            <Button
            onPress={() => this.props.navigation.navigate('AddPin')}
            block style = {{top: 10, height: 60, backgroundColor: '#FFFFFF'}}>
              <Text style = {{color: '#000000'}}>Change Location</Text>
            </Button>

          </Form>

          <Content>
            <Button
            onPress={() => {
              this.addPin();

            }}
            block style = {{top: 20, height: 60, backgroundColor: '#79e56a',}}>
              <Text style = {{color: '#FFFFFF'}}>Create Pin</Text>
            </Button>

            <Button
            onPress={() => {console.log(store.state.pinInfo);
                            this.props.navigation.navigate('Map');
                            this.handleChange('eventName', '');
                            this.handleChange('description', '');
                            this.handleChange('startTime', '');
                            this.handleChange('endTime', '');
                            this.handleDropdown('')}}
            block style = {{top: 30, height: 60, backgroundColor: '#9e9e9e'}}>
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
