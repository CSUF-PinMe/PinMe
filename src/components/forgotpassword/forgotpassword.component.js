import React, { Component } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native'
import { Container, Header, Button, Item, Input, Label} from 'native-base'
import * as Animatable from 'react-native-animatable'
import { Col, Row, Grid } from 'react-native-easy-grid'
import styles from './forgotpassword.style'
import Expo from 'expo';
import {authInfo} from '../../../App.js'
import { Auth } from 'aws-amplify';

 AnimatedItem = Animatable.createAnimatableComponent(Item);
 AnimatedButton = Animatable.createAnimatableComponent(Button);

export default class ForgotPassword extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
        username: "",
    };
  }

  static navigationOptions = {
    header: null
  };

  handleChange(name, value) {
    this.setState({ [name]: value });
  }

  checkInput(){
    let error = false;

    if(this.state.usernameError)
      return true;

    if (this.state.username.trim() === "") {
      this.setState(() => ({ usernameError: "username required." }));
      error = true;
    } else {
      this.setState(() => ({ usernameError: null }));
    }

    return error;
  }

  resetPassword(){
    let username = this.state.username;
    Auth.forgotPassword(username)
    .then(data => {
      console.log(data);
      this.setState({authError: "Sent!"});
      this.refs.authMessage.bounce();
      setTimeout(() => {this.props.navigation.navigate('ChangePassword');}, 1500);
    })
    .catch(err => {
      console.log(err);
      var msg = err.message;
      if(msg.includes("Username/client id combination not found.")){
        this.setState({authError: "Username not found"});
      } else if(msg.includes("[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+")){
        this.setState({authError: "Username is not valid"});
      } else {
        this.setState({authError: err.message});
      }
      this.refs.authMessage.shake();
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
    this.refs.firstTitle.bounceInDown();
    this.refs.secondTitle.bounceInDown();
    this.refs.item.bounceInDown();
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
            <Animatable.Text ref="firstTitle" style={[styles.title, {top: Platform.OS === 'ios' ? 30 : 0}]}>Forgot</Animatable.Text>
            <Animatable.Text ref="secondTitle" style={[styles.title, {top: Platform.OS === 'ios' ? 90 : 60}]}>Password</Animatable.Text>
            <AnimatedItem ref="item" style={styles.inputItem}>
              <Label style={styles.label} >Username</Label>
              <Input placeholderTextColor='#017BB0' placeholder="username" style={styles.input}
                onChangeText={(e) => {
                  this.handleChange('username', e);
                  if(e.trim() !== "") {this.setState(() => ({ usernameError: null }));}
                }}
                value={this.state.username}
              />
            </AnimatedItem>
            {!!this.state.usernameError && (
              <Label style={styles.error}>{this.state.usernameError}</Label>
            )}

            {!!this.state.authError && (
              <Animatable.Text ref="authMessage" style={styles.authMessage}>{this.state.authError}</Animatable.Text>
            )}
          </Col>

          <Row size={1} style={{ backgroundColor: '#03a9f4', justifyContent: 'space-around'}}>

            <Button ref="leftButton" large
              onPress={() => {
                const a = setTimeout(() => {
                  this.props.navigation.goBack();
                }, 0);
              }}
              style={styles.leftButton}
              >
              <Text style={styles.buttonText}>Back to Sign In</Text>
            </Button>

            <Button ref="rightButton" large
              style={styles.rightButton}
              onPress={() => {
                if(this.checkInput()){
                  console.log('something is empty');
                } else {
                  console.log('No empty fields!');
                  this.resetPassword();
                }
              }}
              >
              <Text style={styles.buttonText}>Send</Text>
            </Button>
          </Row>

        </Grid>
      </Container>
    );
  }
}