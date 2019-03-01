import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { Container, Header, Button, Item, Input, Label} from 'native-base';
import { NavigationActions } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Expo, { Constants, Location, Permissions } from 'expo';
import Font from 'expo';
import MapView from 'react-native-maps';
import { Auth } from 'aws-amplify';

 var {width, height} = Dimensions.get('window');

 AnimatedInput = Animatable.createAnimatableComponent(Input);
 AnimatedItem = Animatable.createAnimatableComponent(Item);

export default class ConfirmCode extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
        username: '',
        code: '',
        uLabelHidden: false,
        cLabelHidden: false,
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
      this.setState(() => ({ usernameError: "username required" }));
      error = true;
    } else {
      this.setState(() => ({ usernameError: null }));
    }
    if (this.state.code.trim() === "") {
      this.setState(() => ({ codeError: "code required" }));
      error = true;
    } else {
      this.setState(() => ({ codeError: null }));
    }

    if(error){
      return false;
    } else {
      return true;
    }
  }

  tryConfirm() {
    let username = this.state.username;
    let code = this.state.code;
    Auth.confirmSignUp(username, code, {
          // Optional. Force user confirmation irrespective of existing alias. By default set to True.
          forceAliasCreation: true
      }).then(data => {
        // console.log(data);
        // Check for 'SUCCESS'
        this.setState({authError: "Confirmed!"});
        this.refs.authMessage.bounce();
        setTimeout(() => {this.props.navigation.navigate('SignIn');}, 1500);
      })
        .catch(err => {
          console.log(err);
          var msg = err.message;

          if(msg.includes("[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+")){
            this.setState({authError: "Username is not valid"});
          } else if(msg.includes("Username/client id combination not found.")){
            this.setState({authError: "Username not found"});
          } else if(msg.includes("User cannot be confirm. Current status is CONFIRMED")){
            this.setState({authError: "User is already confirmed."});
          } else {
            this.setState({authError: err.message})
          }

          this.refs.authMessage.shake();
        });
  }

  tryResend(){
    let username = this.state.username;
    if (username.trim() === "") {
      this.refs.resendCode.shake();
      this.setState(() => ({ usernameError: "username required" }));
    } else {
      this.setState(() => ({ usernameError: null }));
      Auth.resendSignUp(username).then((data) => {
        console.log(data);
        console.log('code resent successfully');

        this.setState({authError: "Sent!"});
        this.refs.authMessage.bounce();
      }).catch(err => {
        console.log(err.message);
        var msg = err.message;

        if(msg.includes("[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+")){
          this.setState({authError: "Username is not valid"});
        } else if(msg.includes("Username/client id combination not found.")){
          this.setState({authError: "Username not found"});
        } else {
          this.setState({authError: msg});
        }

        this.refs.authMessage.shake();
      });
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
    this.refs.firstTitle.bounceInDown();
    this.refs.secondTitle.bounceInDown();
    this.refs.username.bounceInDown();
    this.refs.code.bounceInDown();
    this.refs.resendCode.bounceInDown();
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
        <Grid>

          <Col size={10.5} style={{ backgroundColor: '#03a9f4', justifyContent: 'center'}}>
            <Animatable.Text ref="firstTitle" style={styles.firstTitle}>Confirm</Animatable.Text>
            <Animatable.Text ref="secondTitle" style={styles.secondTitle}>Sign Up</Animatable.Text>
            <AnimatedItem ref="username" style={styles.inputItem}>
              <Label style={styles.label} >Username</Label>
              <Input
                iterationCount={2}
                placeholderTextColor='#017BB0'
                placeholder="username" style={styles.input}
                onChangeText={(e) => {
                  this.handleChange('username', e);
                  if(e.trim() !== "") {
                    this.setState(() => ({ usernameError: null }));
                    if(this.state.uLabelHidden === false){
                      // this.refs.usernameLabel.bounceOutLeft();
                      this.setState({uLabelHidden: true})
                    }
                  } else {
                    // this.refs.usernameLabel.bounceInLeft();
                    this.setState({uLabelHidden: false});
                  }
                }}
                value={this.state.username}
              />
            </AnimatedItem>
            {!!this.state.usernameError && (
              <Label style={[styles.error, {left: 18}]}>{this.state.usernameError}</Label>
            )}
            <AnimatedItem ref="code" style={styles.inputItem}>
              <Label style={styles.label} >Confirmation Code</Label>
              <Input placeholderTextColor='#017BB0' placeholder="872030" style={styles.input}
                onChangeText={(e) => {
                  this.handleChange('code', e);
                  if(e.trim() !== "") {
                    this.setState(() => ({ codeError: null }));
                    if(this.state.cLabelHidden === false){
                      // this.refs.codeLabel.bounceOutLeft();
                      this.setState({cLabelHidden: true});
                    }
                  } else {
                    // this.refs.codeLabel.bounceInLeft();
                    this.setState({cLabelHidden: false});
                  }
                }}
                value={this.state.code}
              />
            </AnimatedItem>
            {!!this.state.codeError && (
              <Label style={[styles.error, {left: 18}]}>{this.state.codeError}</Label>
            )}
            <Animatable.Text ref="resendCode" onPress={() => {this.tryResend();}} style={styles.resend}>resend code</Animatable.Text>

            {!!this.state.authError && (
              <Animatable.Text ref="authMessage" style={styles.authMessage}>{this.state.authError}</Animatable.Text>
            )}
          </Col>

          <Row size={1} style={{ backgroundColor: '#03a9f4', justifyContent: 'space-around', bottom: Platform.OS === 'ios' ? null : 10}}>

            <Button large
              onPress={() => {this.props.navigation.navigate('SignUp');}}
              style={styles.leftButton}
              backgroundColor='white'
              >
              <Text style={styles.buttonText}>Back to Sign Up</Text>
            </Button>

            <Button large
              style={styles.rightButton}
              backgroundColor='white'
              onPress={() => {
                if(this.checkInput() === false){
                  console.log('something is empty');
                } else {
                  console.log('No empty fields!');
                  this.tryConfirm();
                }
              }}
              >
              <Text style={styles.buttonText}>Confirm</Text>
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
  resend: {
    left:20,
    bottom: 60,
    color: 'white',
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "200" : null
  },
  error: {
    color: "white",
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    bottom: 70,
  },
  firstTitle: {
    position: 'absolute',
    left: 15,
    color: 'white',
    fontSize: 60,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    top: Platform.OS === 'ios' ? 30 : 5,
    fontWeight: '100'
  },
  secondTitle: {
    position: 'absolute',
    left: 15,
    color: 'white',
    fontSize: 60,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    top: Platform.OS === 'ios' ? 90 : 65,
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
    bottom: 60,
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
