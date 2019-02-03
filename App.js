import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, KeyboardAvoidingView } from 'react-native';
import { Container, Header, Button, Item, Input, Label} from 'native-base';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Expo, { Constants, Location, Permissions } from 'expo';
import { fadeIn, fromLeft, fromBottom, fromTop, fromRight } from 'react-navigation-transitions';
import Font from 'expo';
import MapView from 'react-native-maps';

import ConfirmCode from './confirmcode.component';
import ForgotPassword from './forgotpassword.component';
import SignUp from './signup.component';
import ChangePassword from './changepassword.component';
import TestMain from './testmain.component';

import { Auth } from 'aws-amplify';
import createStore from 'pure-store';
import Amplify from '@aws-amplify/core'
import config from './aws-exports'
Amplify.configure(config)

// import Map from './src/components/map/map.component';

var {width, height} = Dimensions.get('window');

export const store = createStore({
  initialMarkers: [],
  markers: [],
  currentUser: '',
  region: {
    latitude: 36.812617,
    longitude: -119.745802,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0221,
  },
  pinLink: {                // Used for map-link: opening pins in uber, lyft, waze, etc..
    name: undefined,
    latitude: undefined,
    longitude: undefined
  },
  pinInfo: {
    userId: '',
    eventName: '',
    eventType: 'General',
    description: '',
    startTime: '',
    endTime: '',
    latitude: undefined,
    longitude: undefined
  }
})

class SignIn extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
        username: '',
        password: ''
    };

    // const session = Auth.currentAuthenticatedUser({
    //     bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    // }).then(user => console.log(user))
    // .catch(err => console.log(err));
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

    if(error){
      return false;
    } else {
      return true;
    }
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

  trySignIn() {
    let username = this.state.username.trim();
    let password = this.state.password;
    Auth.signIn(
      username, // Required, the username
      password, // Optional, the password
    ).then(user => {
      // console.log(user);
      this.setState({ authError: "Success!" });
      this.refs.authMessage.bounce();
      setTimeout(() => {
        this.props.navigation.navigate('Test');
        this.setState({ authError: null, password: '' });
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

        <Grid>

          <Col size={10.5} style={{ backgroundColor: '#03a9f4', justifyContent: 'center'}}>
            <Label style={[styles.title, {top: 0}]}>Sign In</Label>
            <Item style={styles.inputItem}>
              <Label style={styles.label} >Username</Label>
              <Input placeholderTextColor='#017BB0' placeholder="username" style={styles.input}
                onChangeText={(e) => {
                  this.handleChange('username', e);
                  if(e.trim() !== "") {this.setState(() => ({ usernameError: null }));}
                }}
                value={this.state.email}
              />
            </Item>
            {!!this.state.usernameError && (
              <Label style={[styles.error, {bottom: 70,left: 19}]}>{this.state.usernameError}</Label>
            )}
            <Item style={styles.inputItem}>
              <Label style={styles.label} >Password</Label>
              <Input secureTextEntry={true} placeholderTextColor='#017BB0' placeholder="password" style={styles.input}
                onChangeText={(e) => {
                  this.handleChange('password', e);
                  if(e.trim() !== "") {this.setState(() => ({ passwordError: null }));}
                }}
                value={this.state.password}
              />
            </Item>
            {!!this.state.passwordError && (
              <Label style={[styles.error,{bottom: 70, left: 18}]}>{this.state.passwordError}</Label>
            )}
            <Animatable.Text ref="forgot" onPress={() => this.props.navigation.navigate('ForgotPassword')} style={styles.forgot}>forgot password?</Animatable.Text>

            {!!this.state.authError && (
              <Animatable.Text ref="authMessage" style={styles.authMessage}>{this.state.authError}</Animatable.Text>
            )}

          </Col>
          <Row size={1} style={{ backgroundColor: '#03a9f4', justifyContent: 'space-around'}}>

            <Button large
              onPress={() => this.props.navigation.navigate('SignUp')}
              style={styles.leftButton}
              backgroundColor='white'
              >
              <Text style={styles.buttonText}>New to PinMe?</Text>
            </Button>

            <Button large
              style={styles.rightButton}
              backgroundColor='white'
              onPress={() => {
                if(this.checkInput() === false){
                  console.log('something is empty');
                } else {
                  console.log('No empty fields!');
                  this.trySignIn();
                }
              }}>
              <Text style={styles.buttonText}>Log in</Text>
            </Button>
          </Row>

        </Grid>
      </Container>
    );
  }
}

const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  // Custom transitions go there
  if (prevScene
    && prevScene.route.routeName === 'SignUp'
    && nextScene.route.routeName === 'ConfirmCode') {
    return fromTop();
  } else if (prevScene
    && prevScene.route.routeName === 'SignIn'
    && nextScene.route.routeName === 'ForgotPassword') {
    return fromTop();
  } else if (prevScene
    && prevScene.route.routeName === 'ForgotPassword'
    && nextScene.route.routeName === 'ChangePassword') {
    return fromRight();
  } else if (prevScene
    && prevScene.route.routeName === 'SignIn'
    && nextScene.route.routeName === 'Test') {
    return fromRight();
  }

  return fromLeft();
}

const MainNavigator = createStackNavigator(
  {
    SignIn: {screen: SignIn},
    SignUp: {screen: SignUp},
    ConfirmCode: {screen: ConfirmCode},
    ForgotPassword: {screen: ForgotPassword},
    ChangePassword: {screen: ChangePassword},
    Map: {screen: Map},
    Test: {screen: TestMain}
  },
  {
    initialRoute: 'SignIn',
    transitionConfig: (nav) => handleCustomTransition(nav),
  },
);

const AppContainer = createAppContainer(MainNavigator);
export default AppContainer;

// export default class App extends Component {
//   render(){
//     return(
//       <MainNavigator />
//     )
//   }
// }



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
  error: {
    color: "white",
    fontFamily: 'sans-serif-thin'
  },
  title: {
    position: 'absolute',
    left: 15,
    color: 'white',
    fontSize: 60,
    fontFamily: 'sans-serif-thin'
  },
  label: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'sans-serif-thin'
  },
  forgot: {
    left:20,
    bottom: 60,
    color: 'white',
    fontSize: 20,
    fontFamily: 'sans-serif-thin'
  },
  input: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'sans-serif-light',
    marginRight: 20,
    top: 3,
  },
  inputItem: {
    bottom: 60,
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
    justifyContent: 'center'
  },
  rightButton: {
    width: width/2-20,
    height: 55,
    marginRight: 5,
    justifyContent: 'center'
  }
});
