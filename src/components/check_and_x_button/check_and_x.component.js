import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Container, Header, Title, Content, Form, Item, Input, Button, Label, Icon, Left, Body, Right, Picker, Textarea, Fab} from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import Font from 'expo';
import MapView from 'react-native-maps';

export default class CheckX extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
        active: false,
        active1: false,
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
        <View style={{ flex: 1 }}>
          <Fab
            active1={this.state.active1}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#79e56a' }}
            position="bottomRight"
            onPress={() => this.setState({ active1: !this.state.active1 })}>
            <Icon name="checkmark" />
          </Fab>
        </View>

        <View style={{ flex: 0 }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#ed2224' }}
            position="bottomLeft"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="close" />
          </Fab>
        </View>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
});