import React, { Component } from 'react'
import { Dimensions, Text, StatusBar, Platform } from 'react-native'
import { Container, Button, Item, Input, Label} from 'native-base'
import { StackActions, NavigationActions } from 'react-navigation'
import * as Animatable from 'react-native-animatable'
import { Col, Row, Grid } from 'react-native-easy-grid'
import Expo from 'expo'
import { Auth } from 'aws-amplify'
import styles from './signin.style'
import {store} from '../../../App'

AnimatedItem = Animatable.createAnimatableComponent(Item);
AnimatedButton = Animatable.createAnimatableComponent(Button);

// Create 'loading' screen to check for authentication

var {width, height} = Dimensions.get('window');

export default class SignIn extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
        username: '',
        password: ''
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
    if (this.state.username.trim() === "") {
      this.setState(() => ({ usernameError: "username required" }));
      error = true;
    } else {
      this.setState(() => ({ usernameError: null }));
    }
    if (this.state.password.trim() === "") {
      this.setState(() => ({ passwordError: "password required" }));
      error = true;
    } else {
      this.setState(() => ({ passwordError: null }));
    }

    return error;
  }

  // Needed for Native-Base Buttons
  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ loading: false });
    this.refs.title.bounceInLeft();
    this.refs.username.bounceInLeft();
    this.refs.password.bounceInLeft();
    this.refs.forgot.bounceInLeft();
    // this.refs.leftbutton.bounceInLeft();
  }

  async componentWillUnmount(){
    this.setState({ authError: null, password: '' });
  }

  trySignIn() {
    let username = this.state.username.trim();
    let password = this.state.password;
    Auth.signIn(
      username,
      password,
    ).then(user => {
      // console.log(user);
      this.setState({ authError: "Success!" });
      store.update({currentUser: username});
      this.refs.authMessage.bounce();
      setTimeout(() => {
        const resetAction = StackActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'SignIn' }),
            NavigationActions.navigate({ routeName: 'Map' }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      }, 1500);
    })
    .catch(err => {
      // console.log(err.message);
      var msg = err.message;
      if(msg.startsWith("2 validation")){
        this.setState({authError: "username is invalid"});
      } else {
        this.setState({authError: err.message});
      }
      this.refs.authMessage.shake();
    });
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
      <StatusBar hidden/>

        <Grid style={{backgroundColor: '#03a9f4'}}>

          <Col size={10.5} style={{ backgroundColor: '#03a9f4', justifyContent: 'center'}}>
            <Animatable.Text onPress={() => console.log('sign in pressed.')} ref="title" style={[styles.title]}>Sign In</Animatable.Text>
            <AnimatedItem ref="username" style={styles.inputItem}>
              <Label style={styles.label} >Username</Label>
              <Input placeholderTextColor='#017BB0' placeholder="username" style={styles.input}
                onChangeText={(e) => {
                  this.handleChange('username', e);
                  if(e.trim() !== "") {this.setState(() => ({ usernameError: null }));}
                }}
                value={this.state.email}
              />
            </AnimatedItem>
            {!!this.state.usernameError && (
              <Label style={[styles.error, {bottom: 70,left: 19}]}>{this.state.usernameError}</Label>
            )}
            <AnimatedItem ref="password" style={styles.inputItem}>
              <Label style={styles.label} >Password</Label>
              <Input secureTextEntry={true} placeholderTextColor='#017BB0' placeholder="password" style={styles.input}
                onChangeText={(e) => {
                  this.handleChange('password', e);
                  if(e.trim() !== "") {this.setState(() => ({ passwordError: null }));}
                }}
                value={this.state.password}
              />
            </AnimatedItem>
            {!!this.state.passwordError && (
              <Label style={[styles.error,{bottom: 70, left: 18}]}>{this.state.passwordError}</Label>
            )}
            <Animatable.Text ref="forgot" onPress={() => this.props.navigation.navigate('ForgotPassword')} style={styles.forgot}>forgot password?</Animatable.Text>

            {!!this.state.authError && (
              <Animatable.Text ref="authMessage" style={styles.authMessage}>{this.state.authError}</Animatable.Text>
            )}
          </Col>
          <Row size={1} style={{ backgroundColor: '#03a9f4', justifyContent: 'space-around', bottom: Platform.OS === 'ios' ? null : 10}}>

            <AnimatedButton large
              ref="leftbutton"
              onPress={() => this.props.navigation.navigate('SignUp')}
              style={styles.leftButton}
              >
              <Text style={styles.buttonText}>New to PinMe?</Text>
            </AnimatedButton>

            <AnimatedButton large
              style={styles.rightButton}
              onPress={() => {
                if(this.checkInput()){
                  console.log('something is empty');
                } else {
                  console.log('No empty fields!');
                  this.trySignIn();
                }
              }}>
              <Text style={styles.buttonText}>Log in</Text>
            </AnimatedButton>

          </Row>
        </Grid>
      </Container>
    );
  }
}