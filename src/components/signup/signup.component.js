import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { Container, Header, Button, Item, Input, Label} from 'native-base';
import * as Animatable from 'react-native-animatable';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Expo, { Constants, Location, Permissions } from 'expo';
import Font from 'expo';
import MapView from 'react-native-maps';
import { Auth } from 'aws-amplify';

 var {width, height} = Dimensions.get('window');

export default class SignUp extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
        email: '',
        password: '',
        username: '',
        number: ''
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

    if (this.state.email.trim() === "") {
      this.setState(() => ({ emailError: "email required" }));
      error = true;
    } else {
      this.setState(() => ({ emailError: null }));
    }

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

    if (this.state.number.trim() === "") {
      this.setState(() => ({ numberError: "phone number required" }));
      error = true;
    } else {
      this.setState(() => ({ numberError: null }));
    }

    if(error){
      return false;
    } else {
      return true;
    }
  }

  // Needed for Native-Base Buttons
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ loading: false });
    this.refs.title.bounceInDown();
    this.refs.email.bounceInLeft();
    this.refs.username.bounceInLeft();
    this.refs.password.bounceInLeft();
    this.refs.number.bounceInLeft();
    this.refs.confirm.bounceInLeft();
  }

  trySignUp() {
    let username = this.state.username;
    let password = this.state.password;
    let email = this.state.email;
    let phone_number = this.state.number;
    Auth.signUp({
        username,
        password,
        attributes: {
            email,          // optional
            phone_number,   // optional - E.164 number convention
            // other custom attributes
        },
        validationData: []  //optional
        })
        .then(data => {
          // console.log(data);
          this.setState({authError: "Account created!"})
          this.refs.authMessage.bounce();
          setTimeout(() => {this.props.navigation.navigate('ConfirmCode');}, 1500);
        })
        .catch(err => {
          console.log(err);
          var msg = err.message;

          if(msg.includes("[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+")){
            this.setState({authError: "Username is not valid"});
          } else if(msg.includes("^[\\S]+.*[\\S]+$")){
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
            <Animatable.Text ref="title" style={styles.title}>Sign Up</Animatable.Text>
            <AnimatedItem ref="email" style={styles.inputItem}>
              <Label style={styles.label} >Email</Label>
              <Input placeholderTextColor='#017BB0' placeholder="email" style={styles.input}
                onChangeText={(e) => {
                  this.handleChange('email', e);
                  if(e.trim() !== "") {this.setState(() => ({ emailError: null }));}
                }}
                value={this.state.email}
              />
            </AnimatedItem>
            {!!this.state.emailError && (
              <Label style={[styles.error, {left: 18}]}>{this.state.emailError}</Label>
            )}
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
              <Label style={[styles.error, {left: 19}]}>{this.state.usernameError}</Label>
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
              <Label style={[styles.error, {left: 18}]}>{this.state.passwordError}</Label>
            )}
            <AnimatedItem ref="number" style={styles.inputItem}>
              <Label style={styles.label} >Phone Number</Label>
              <Input placeholderTextColor='#017BB0' placeholder="+15595677541" style={styles.input}
                onChangeText={(e) => {
                  this.handleChange('number', e);
                  if(e.trim() !== "") {this.setState(() => ({ numberError: null }));}
                }}
                value={this.state.number}
              />
            </AnimatedItem>
            {!!this.state.numberError && (
              <Label style={[styles.error, {left: 18}]}>{this.state.numberError}</Label>
            )}
            <Animatable.Text ref="confirm" onPress={() => {this.props.navigation.navigate('ConfirmCode')}} style={styles.confirm}>confirm a code</Animatable.Text>

            {!!this.state.authError && (
              <Animatable.Text ref="authMessage" style={styles.authMessage}>{this.state.authError}</Animatable.Text>
            )}
          </Col>

          <Row size={1} style={{ backgroundColor: '#03a9f4', justifyContent: 'space-around', bottom: Platform.OS === 'ios' ? null : 10}}>

            <Button large
              onPress={() => this.props.navigation.navigate('SignIn')}
              style={styles.leftButton}
              backgroundColor='white'
              >
              <Text style={styles.buttonText}>Have an Account?</Text>
            </Button>

            <Button large
              style={styles.rightButton}
              backgroundColor='white'
              onPress={() => {
                if(this.checkInput() === false){
                  console.log('something is empty');
                } else {
                  console.log('No empty fields!');
                  this.trySignUp();
                }
              }}>
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
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null,
    bottom: Platform.OS === 'ios' ? 40 : 20,
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 20
  },
  confirm: {
    left:20,
    bottom: 50,
    color: 'white',
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null
  },
  error: {
    color: "white",
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null,
    bottom: 60,
  },
  title: {
    position: 'absolute',
    left: 15,
    color: 'white',
    fontSize: 60,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null,
    top: Platform.OS === 'ios' ? 30 : 0,
    fontWeight: '100'
  },
  label: {
    color: 'white',
    fontSize: 30,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null
  },
  input: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    marginRight: 20,
    top: 3,
  },
  inputItem: {
    bottom: 50,
    left: 15,
    borderColor: 'transparent'
  },
  buttonText: {
    color: '#03a9f4',
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-light'
  },
  leftButton: {
    width: width/2-20,
    height: 55,
    marginLeft: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    bottom: Platform.OS === 'ios' ? 15 : 0
  },
  rightButton: {
    width: width/2-20,
    height: 55,
    marginRight: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    bottom: Platform.OS === 'ios' ? 15 : 0
  }
});
