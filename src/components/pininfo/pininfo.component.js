import { Container, Header, Title, Content, Form, Item, Input, Button, Label, Icon, Left, Body, Right, Picker, Textarea} from 'native-base';
import { StyleSheet, Text, View, Dimensions, TouchableHighlight, StatusBar, Alert, Platform, Image, ScrollView } from 'react-native';
import React, { Component } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Font from 'expo';
import MapView, { ProviderPropType } from 'react-native-maps';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Expo, { Constants, Location, Permissions } from 'expo';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import redPin from '../../../assets/pin_red.png'
import {store} from '../../../App'
import { Auth } from 'aws-amplify'

const {width, height} = Dimensions.get("window");
const Screen = {
  width: Dimensions.get('window').width,
  height: '100%',
};

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
        latitude: undefined,
        longitude: undefined
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
      <StatusBar hidden={true} />
      <Grid>
        <Row style={{ borderRadius: 5, borderTopWidth: 3, borderColor: 'white',}} size={3}>
          <TouchableHighlight
            onPress={() => Alert.alert(
              "Changing Pin Location",
              "Do you want to change the location of the pin?",
              [
                {text: 'OK', onPress: () => this.props.navigation.navigate('AddPin')},
                {text: 'Cancel', onPress: () => {return}, style: 'cancel'},
              ]
            )}
          >
            <Image style={{width: width, height: height*.3}} source={{uri: this.props.navigation.getParam('snapshot', 'some default value')}}/>
          </TouchableHighlight>
          <View pointerEvents="none" style={{width: width, height: height*.3, position: 'absolute', alignItems: 'center'}}>
            <Image source={redPin} style={{transform: [{ scale: .35 }], top: 25}}/>
          </View>
        </Row>
        <Col size={7} style={{backgroundColor: "#03a9f4", borderColor: '#03a9f4', borderRadius: 20, borderWidth: 3}}>
        <KeyboardAwareScrollView
        style={{backgroundColor: '#03a9f4', borderColor: '#03a9f4', borderRadius: 20, borderWidth: 2}}
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.scrollContainer}
          scrollEnabled={true}
          enableOnAndroid={true}
        >
          <Item style={{borderColor: 'transparent', top: 5}}>
            <Label style={styles.label}>Pin Name: </Label>
            <Input style={styles.input} placeholderTextColor='#017BB0' placeholder="name of pin"/>
          </Item>
          <Item style={{borderColor: 'transparent', top: 5}}>
            <Label style={styles.label}>Description: </Label>
          </Item>
          <Item style={{borderColor: 'transparent', top: 5}}>
          <Input editable={true} multiline={true} style={styles.input, {left: 10}} placeholderTextColor='#017BB0' placeholder="description of your pin"/>
          </Item>
          <Item style={{borderColor: 'transparent', top: 5}}>
            <Label style={styles.label}>Type: </Label>
            <Input style={styles.input} placeholderTextColor='#017BB0' placeholder="type of pin"/>
          </Item>
          <Item style={{borderColor: 'transparent', top: 5}}>
            <Label style={styles.label}>Start Time: </Label>
            <Input style={styles.input} placeholderTextColor='#017BB0' placeholder="start time"/>
          </Item>
          <Item style={{borderColor: 'transparent', top: 5}}>
            <Label style={styles.label}>End Time: </Label>
            <Input style={styles.input} placeholderTextColor='#017BB0' placeholder="end time"/>
          </Item>
        </KeyboardAwareScrollView>
        </Col>
      </Grid>
      </Container>
    );
  }
}

PinInfo.propTypes = {
  provider: ProviderPropType,
}


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#03a9f4',
  },
  label: {
    color: 'white',
    fontSize: 28,
    left: 10,
    top: 10,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null
  },
  input: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    marginRight: 20,
    top: 10
  }
});
