import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Dimensions,
    StatusBar
 } from 'react-native';
import { 
        Container, 
        Header, 
        Content, 
        Text, 
        Icon,
        Button,
        Left,
} from 'native-base';

class HomeScreen extends Component {
  render() {
    return (
        <Container>
        <StatusBar hidden/>

          <Header>
          <View style={{ width: Dimensions.get('window').width * 0.9 }}>
              <Icon name="ios-menu" onPress={
                ()=>
                this.props.navigation.openDrawer()}/>
            </View>
          </Header>
        <Content>
          <Text>Profile</Text>
        </Content>
      </Container>
    );
  }
}

export default HomeScreen;


