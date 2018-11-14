import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Container, Header, Title, Content, ListItem, CheckBox, Form, Item, Input, Button, Label, Icon, Left, Body, Right, Picker, Textarea, Fab} from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import Font from 'expo';
import MapView from 'react-native-maps';

export default class FilterPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading: true,
      checked0: false,
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      checked5: false,
      checked6: false,
    };
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
        <Header style = {{backgroundColor: '#03a9f4', height: 65}}>
        <View style = {{top: 20}}>
          <Body>
            <Title>Filters</Title>
          </Body>
        </View>
        </Header>

        <Content>
          <ListItem>
            <CheckBox checked={this.state.checked0} onPress={() => this.setState({ checked0: !this.state.checked0 })} />
            <Body>
              <Text>  Accident</Text>
            </Body>
          </ListItem>
          <ListItem>
            <CheckBox checked={this.state.checked1} onPress={() => this.setState({ checked1: !this.state.checked1 })} />
            <Body>
              <Text>  Food</Text>
            </Body>
          </ListItem>
          <ListItem>
            <CheckBox checked={this.state.checked2} onPress={() => this.setState({ checked2: !this.state.checked2 })}/>
            <Body>
              <Text>  Social</Text>
            </Body>
          </ListItem>
          <ListItem>
            <CheckBox checked={this.state.checked3} onPress={() => this.setState({ checked3: !this.state.checked3 })}/>
            <Body>
              <Text>  Study</Text>
            </Body>
          </ListItem>

          <ListItem>
            <CheckBox checked={this.state.checked4} onPress={() => this.setState({ checked4: !this.state.checked4 })}/>
            <Body>
              <Text>  Closest in Time</Text>
            </Body>
          </ListItem>

          <ListItem>
            <CheckBox checked={this.state.checked5} onPress={() => this.setState({ checked5: !this.state.checked5 })}/>
            <Body>
              <Text>  Closest in Distance</Text>
            </Body>
          </ListItem>

          <ListItem>
            <CheckBox checked={this.state.checked6} onPress={() => this.setState({ checked6: !this.state.checked6 })}/>
            <Body>
              <Text>  Sort By Day of the Week</Text>
              <Item picker >
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                style={{ width: undefined }}
                placeholder="Event Type"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selected2}
                onValueChange={this.onValueChange2.bind(this)}
              >
                <Picker.Item label="Any" value="key0" color= '#9e9e9e'/>
                <Picker.Item label="Sunday" value="key1" />
                <Picker.Item label="Monday" value="key2" />
                <Picker.Item label="Tuesday" value="key3" />
                <Picker.Item label="Wednesday" value="key4" />
                <Picker.Item label="Thursday" value="key5" />
                <Picker.Item label="Friday" value="key6" />
                <Picker.Item label="Saturday" value="key7" />
              </Picker>
            </Item>
            </Body>
          </ListItem>

          <Content>
            <Button block style = {{top: 20, height: 60, backgroundColor: '#79e56a'}}>
              <Text style = {{color: '#FFFFFF'}}>Save Selections</Text>
            </Button>
            <Button block style = {{top: 30, height: 60, backgroundColor: '#9e9e9e'}}>
              <Text style = {{color: '#FFFFFF'}}>Cancel</Text>
            </Button>
            <Button disabled style = {{top: 40, height: 60, backgroundColor: '#FFFFFF'}}>
            </Button>
          </Content>

        </Content>
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