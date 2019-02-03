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

export default class ChangePassword extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
        username: "",
        code: "",
        newpassword: "",
    };
  }

  static navigationOptions = {
    header: null
  }

  handleChange(name, value) {
    this.setState({ [name]: value });
  }

  checkInput(){
    let error = false;
    if (this.state.username.trim() === "") {
      this.setState(() => ({ usernameError: "username required." }));
      error = true;
    } else {
      this.setState(() => ({ usernameError: null }));
    }
    if (this.state.code.trim() === "") {
      this.setState(() => ({ codeError: "code required." }));
      error = true;
    } else {
      this.setState(() => ({ codeError: null }));
    }
    if (this.state.newpassword.trim() === "") {
      this.setState(() => ({ newPasswordError: "new password required." }));
      error = true;
    } else {
      this.setState(() => ({ newPasswordError: null }));
    }

    if(error){
      return false;
    } else {
      return true;
    }
  }

  changePassword(){
    let username = this.state.username;
    let code = this.state.code;
    let newpassword = this.state.newpassword;
    Auth.forgotPasswordSubmit(username, code, newpassword)
    .then(data => {
      console.log(data);

      this.setState({authError: "Password changed!"});
      this.refs.authMessage.bounce();
      setTimeout(() => {this.props.navigation.navigate('SignIn')}, 1500);
    })
    .catch(err => {
      console.log(err.message);
      var msg = err.message;


      if(msg.includes("^[\\S]+.*[\\S]+$")){
        this.setState({authError: "Password is not strong enough"});
      } else if(msg.includes("uppercase characters")){
        this.setState({authError: "Password must have uppercase characters"});
      } else if(msg.includes("numeric characters")){
        this.setState({authError: "Password must have numeric characters"});
      } else if(msg.includes("symbol characters")){
        this.setState({authError: "Password must have symbol characters"});
      } else if(msg.includes("length greater than or equal to 6") || msg.includes("Password not long enough")){
        this.setState({authError: "Password is too short"});
      } else {
        this.setState({authError: msg});
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
    this.refs.firstTitle.bounceInRight();
    this.refs.secondTitle.bounceInRight();
    this.refs.username.bounceInRight();
    this.refs.code.bounceInRight();
    this.refs.newpassword.bounceInRight();
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
            <Animatable.Text ref="firstTitle" style={[styles.title, {top: 0}]}>Change</Animatable.Text>
            <Animatable.Text ref="secondTitle" style={[styles.title, {top: 60}]}>Password</Animatable.Text>
            <AnimatedItem ref="username" style={styles.inputItem}>
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
            <AnimatedItem ref="code" style={styles.inputItem}>
              <Label style={styles.label} >Code</Label>
              <Input placeholderTextColor='#017BB0' placeholder="code" style={styles.input}
                onChangeText={(e) => {
                  this.handleChange('code', e);
                  if(e.trim() !== "") {this.setState(() => ({ codeError: null }));}
                }}
                value={this.state.code}
              />
            </AnimatedItem>
            {!!this.state.codeError && (
              <Label style={styles.error}>{this.state.codeError}</Label>
            )}
            <AnimatedItem ref="newpassword" style={styles.inputItem}>
              <Label style={styles.label} >New Password</Label>
              <Input secureTextEntry={true} placeholderTextColor='#017BB0' placeholder="new password" style={styles.input}
                onChangeText={(e) => {
                  this.handleChange('newpassword', e);
                  if(e.trim() !== "") {this.setState(() => ({ newPasswordError: null }));}
                }}
                value={this.state.newpassword}
              />
            </AnimatedItem>
            {!!this.state.newPasswordError && (
              <Label style={styles.error}>{this.state.newPasswordError}</Label>
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
              <Text style={styles.buttonText}>Back</Text>
            </Button>

            <Button ref="rightButton" large
              style={styles.rightButton}
              onPress={() => {
                if(this.checkInput() === false){
                  console.log('something is empty');
                } else {
                  console.log('No empty fields!');
                  this.changePassword();
                }
              }}
              >
              <Text style={styles.buttonText}>Submit</Text>
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
  authMessage: {
    color: "white",
    fontFamily: 'sans-serif-thin',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
    fontSize: 20
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
