import React, { Component } from 'react';
import { 
    View,
    StyleSheet, 
    Dimensions,
    StatusBar,
    ScrollView
 } from 'react-native';
import { 
        Container, 
        Header, 
        Content, 
        Text, 
        Icon,
        Button,
        Left,
        Card,
        CardItem,
        Body, 
        List,
        Item,
        Input

} from 'native-base';

class SettingsScreen extends Component {
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
          <Text>Search</Text>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20
  }
});

export default SettingsScreen;

