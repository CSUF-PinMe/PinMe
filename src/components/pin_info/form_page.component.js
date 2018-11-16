import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Container, Header, Title, Content, Form, Item, Input, Button, Label, Icon, Left, Body, Right, Picker, Textarea} from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo'
import API, { graphqlOperation } from '@aws-amplify/api'
import * as mutations from '../../graphql/mutations'

let id = 0;
var {height, width} = Dimensions.get('window');

const initialRegion = {
  latitude: 36.812617,
  longitude: -119.745802,
  latitudeDelta: 0.0422,
  longitudeDelta: 0.0221,
}

const pin = {
  userId: '123',
  eventName: 'new pin',
  eventType: 'type',
  description: 'my description',
  latitude: 36.812617,
  longitude: -119.745802
}



export default class FormPage extends Component {
  constructor(props){
    super(props);
    const { navigation } = this.props;

    this.state = {
        loading: true,
        selected: undefined,
        selected2: undefined,
        region: navigation.getParam('region', initialRegion),
        markers: navigation.getParam('markers', pin),
        color: 'navy',
        loading: true
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

  static navigationOptions = {
    header: null
  }

  addPin() {

    const newPin = API.graphql(graphqlOperation(mutations.createPin,
      {
        input:
        {
          userId: '123',
          eventName: 'new pin',
          eventType: 'my type',
          description: 'my description',
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude
        }
      }
    ));
    //this.props.navigation.state.params.refresh();
    this.props.navigation.goBack();
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

            <Button 
            onPress={() => this.props.navigation.navigate('AddPin')}
            block style = {{top: 10, height: 60, backgroundColor: '#FFFFFF'}}>
              <Text style = {{color: '#000000'}}>Change Location</Text>
            </Button>

          </Form>

          <Content>
            <Button 
            onPress={() => this.addPin()} 
            block style = {{top: 20, height: 60, backgroundColor: '#79e56a',}}>
              <Text style = {{color: '#FFFFFF'}}>Create Pin</Text>
            </Button>
            <Button
            onPress={() => this.props.navigation.navigate('Map')} 
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