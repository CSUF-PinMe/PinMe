import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, KeyboardAvoidingView } from 'react-native';
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
      }).then(data => {console.log(data); this.props.navigation.navigate('SignIn');})
        .catch(err => console.log(err));
  }

  tryResend(){
    let username = this.state.username;
    if (username.trim() === "") {
      this.refs.resendCode.shake();
      this.setState(() => ({ usernameError: "username required" }));
    } else {
      this.setState(() => ({ usernameError: null }));
      Auth.resendSignUp(username).then((data) => {
        this.refs.resendCode.bounce();
        console.log('code resent successfully');
        console.log(data);
      }).catch(e => {
        this.refs.resendCode.shake();
        console.log(e.message);
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
      <StatusBar hidden/>

        <Grid>

          <Col size={10.5} style={{ backgroundColor: '#03a9f4', justifyContent: 'center'}}>
            <Animatable.Text ref="firstTitle" style={[styles.title, {top: 5}]}>Confirm</Animatable.Text>
            <Animatable.Text ref="secondTitle" style={[styles.title, {top: 65}]}>Sign Up</Animatable.Text>
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
          </Col>

          <Row size={1} style={{ backgroundColor: '#03a9f4', justifyContent: 'space-around'}}>

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
  resend: {
    left:20,
    bottom: 60,
    color: 'white',
    fontSize: 20,
    fontFamily: 'sans-serif-thin'
  },
  error: {
    color: "white",
    fontFamily: 'sans-serif-thin',
    bottom: 70,
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
