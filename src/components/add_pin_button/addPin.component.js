import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Container, Header, Title, Content, Form, Item, Input, Button, Label, Icon, Left, Body, Right, Picker, Textarea, Fab} from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import Font from 'expo';
import MapView from 'react-native-maps';

export default class AddPin extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
        active: false,
        active1: false,
    };
  }
  onValueChange(value: string) {
    this.setState({
      selected: value
    });
  } 
  onValueChange2(value: string) {
    this.setState({
      selected2: value
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
            direction="right"
            containerStyle={{ }}
            style={{ backgroundColor: '#03a9f4' }}
            position="topLeft"
            onPress={() => this.setState({ active1: !this.state.active1 })}>
            <Icon name="menu" />
          </Fab>
        </View>

        <View style={{ flex: 1 }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#03a9f4' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="add" />
            <Button style={{ backgroundColor: '#03a9f4' }}>
              <Icon name="pin" />
            </Button>
            <Button style={{ backgroundColor: '#FFFFFF'}}>
              <Icon style = {{color: '#03a9f4'}} name="locate"/>
            </Button>
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