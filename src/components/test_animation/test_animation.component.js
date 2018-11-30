import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Button, Fab, Icon } from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import MapView from 'react-native-maps';
import * as Animatable from 'react-native-animatable';

export default class Test extends Component {
  constructor(props){
    super(props);

    this.state = {
        active: false,
        margin_onClick: false,
    }
  }

  render() {
    if (this.state.margin_onClick === true) {
        margin_gap = 60;
      } else {
        margin_gap = 0;
      }
    return (
<Container>
<View style={{ flex: 1}}>
<Fab
  active={this.state.active}
  margin_onClick={this.state.margin_onClick}
  direction="up"
  containerStyle={{ marginBottom: margin_gap}}
  style={{ backgroundColor: '#03a9f4' }}
  position= "bottomRight"
  onPress={() => this.setState({ active: !this.state.active, margin_onClick: !this.state.margin_onClick})}>
  <Icon name="add" />
  <Button style={{ backgroundColor: '#03a9f4' }}
    onPress={() => this.props.navigation.navigate('AddPin')}>
    <Icon name="pin" />
  </Button>
  <Button style={{ backgroundColor: '#FFFFFF'}}
    onPress={this._getLocationAsync}
    >
    <Icon style = {{color: '#03a9f4'}} name="locate"/>
  </Button>
  <Button style={{ backgroundColor: '#FFFFFF'}}
    onPress={this.loadPins}
    >
    <Icon style = {{color: '#03a9f4'}} name="refresh"/>
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