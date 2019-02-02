import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, KeyboardAvoidingView } from 'react-native';
import { Container, Header, Button, Item, Input, Label} from 'native-base';
import * as Animatable from 'react-native-animatable';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Expo, { Constants, Location, Permissions } from 'expo';
import Font from 'expo';
import MapView from 'react-native-maps';
import {authInfo} from './App.js'
import { Auth } from 'aws-amplify';

 var {width, height} = Dimensions.get('window');

 AnimatedItem = Animatable.createAnimatableComponent(Item);

export default class TestMain extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
    };
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
    this.setState({ loading: false });
    this.refs.title.bounceInRight();
  }

  trySignOut(){
    Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));
    this.props.navigation.navigate('SignIn');
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
      <StatusBar hidden/>

        <Grid>

          <Col size={10.5} style={{ backgroundColor: '#03a9f4', justifyContent: 'center'}}>
            <Animatable.Text ref="title" style={[styles.title, {top: 0}]}>Test Main Page</Animatable.Text>
          </Col>

          <Row size={1} style={{ backgroundColor: '#03a9f4', justifyContent: 'space-around'}}>

            <Button ref="leftButton" large
              onPress={() => this.trySignOut()}
              style={styles.leftButton}
              >
              <Text style={styles.buttonText}>Sign Out</Text>
            </Button>

            <Button ref="rightButton" large
              style={styles.rightButton}
              >
              <Text style={styles.buttonText}>Nothing</Text>
            </Button>
          </Row>

        </Grid>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  label: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'sans-serif-thin'
  },
  title: {
    position: 'absolute',
    left: 15,
    color: 'white',
    fontSize: 60,
    fontFamily: 'sans-serif-thin'
  },
  error: {
    bottom: 90,
    color: "white",
    fontFamily: 'sans-serif-thin',
    left: 19
  },
  input: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'sans-serif-light',
    marginRight: 20,
    top: 3,
  },
  inputItem: {
    bottom: 80,
    left: 15,
    borderColor: 'transparent'
  },
  buttonText: {
    color: '#03a9f4',
    fontSize: 15,
    fontFamily: 'sans-serif-light'
  },
  leftButton: {
    width: width/2-20,
    height: 55,
    marginLeft: 5,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  rightButton: {
    width: width/2-20,
    height: 55,
    marginRight: 5,
    justifyContent: 'center',
    backgroundColor: 'white'
  }
});
