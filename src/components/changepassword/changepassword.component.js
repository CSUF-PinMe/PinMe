import React, { Component } from 'react'
import { Text, StatusBar, Platform } from 'react-native'
import { Container, Button, Item, Input, Label} from 'native-base'
import * as Animatable from 'react-native-animatable'
import { Col, Row, Grid } from 'react-native-easy-grid'
import styles from './changepassword.style'
import Expo from 'expo'
import {authInfo} from '../../../App.js'
import { Auth } from 'aws-amplify'

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
  };

  handleChange(name, value) {
    this.setState({ [name]: value });
  }

  checkInput(){
    let error = false;

    if (this.state.usernameError || this.state.codeError || this.state.newPasswordError)
      return true;

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

    return error;
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
            <Animatable.Text ref="firstTitle" style={[styles.title, {top: Platform.OS === 'ios' ? 30 : 0}]}>Change</Animatable.Text>
            <Animatable.Text ref="secondTitle" style={[styles.title, {top: Platform.OS === 'ios' ? 90 : 60}]}>Password</Animatable.Text>
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
                if(this.checkInput()){
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