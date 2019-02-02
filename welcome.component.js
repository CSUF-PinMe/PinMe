import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, StatusBar, KeyboardAvoidingView } from 'react-native';
import { Container, Header, Button, Item, Input, Label} from 'native-base';
import * as Animatable from 'react-native-animatable';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Expo, { Constants, Location, Permissions } from 'expo';
import Font from 'expo';
import MapView from 'react-native-maps';

 var {width, height} = Dimensions.get('window');

 AnimatedItem = Animatable.createAnimatableComponent(Item);
 AnimatedImage = Animatable.createAnimatableComponent(Image);

export default class Welcome extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
        username: "",
    };
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

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
      <StatusBar hidden/>

        <Grid>

          <Col size={10.5} style={{ backgroundColor: '#03a9f4'}}>
            <Item style={{alignItems: 'flex-end',borderBottomWidth: 0, justifyContent: 'center'}}>
              <AnimatedImage
                style={{width: 200, height: 200, top:60}}
                resizeMode='contain'
                source={require('./assets/pinme_icon_new.png')}
              />
              <Animatable.Text ref="firstTitle" style={[styles.title, {right: 50}]}>PinMe</Animatable.Text>
            </Item>
          </Col>

          <Row size={1} style={{ backgroundColor: '#03a9f4', justifyContent: 'space-around'}}>
            <Button ref="leftButton" large
              onPress={() => {console.log(`'Back to Sign In' button was pressed.`)}}
              style={styles.leftButton}
              >
              <Text style={styles.buttonText}>Back to Sign In</Text>
            </Button>
            <Button ref="rightButton" large
              style={styles.rightButton}
              onPress={() => {
                if(this.checkInput() === false){
                  console.log('something is empty');
                } else {
                  console.log('No empty fields!');
                  console.log(this.state);
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
