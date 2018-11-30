import styles from './addpinmap.component.style.js';
import myMapStyle from '../map/mapstyle';
import { Container, Header, Content, Button, Text, Icon, Fab, Footer} from 'native-base';
import Expo, { Constants, Location, Permissions } from 'expo';
import MapView, { Marker } from 'react-native-maps';
import API, { graphqlOperation } from '@aws-amplify/api'
import * as mutations from '../../graphql/mutations';
import redPin from '../../../assets/pin_red.png'
import grayPin from '../../../assets/pin_gray.png'
import React, { Component } from 'react';
import {store} from '../../../App'
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image
} from 'react-native';

var {height, width} = Dimensions.get('window');

export default class AddPinMap extends Component {
  constructor(props){
    super(props);
    const { navigation } = this.props;

    this.state ={
      loading: true,
    };
  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
      FontAwesome: require('react-native-vector-icons/Fonts/FontAwesome.ttf'),
      Entypo: require('react-native-vector-icons/Fonts/Entypo.ttf'),
    });
    this.setState({ loading: false }),
    console.log(store.state.region)
  }

  static navigationOptions = {
    header: null
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <View style={styles.container}>
          <StatusBar hidden/>
          <View style={styles.container}>
            <MapView
            style={styles.map}
            onRegionChange={(region) => store.update({region})}
            initialRegion={store.state.region}
            customMapStyle={myMapStyle}
            >
            {store.state.markers.map((marker, index) => (
              <Marker
                key={marker.key}
                coordinate={marker.coordinate}
                image={grayPin}
              />
            ))}
            </MapView>
          </View>

          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 40, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={redPin} style={{transform: [{ scale: .35 }]}}/>
          </View>

            <View style={styles.button1Container}>
            <Fab
            style={{ backgroundColor: '#ed2224' }}
            position="bottomLeft"
            onPress={() => this.props.navigation.navigate('Map')}>
            <Icon name="close" />
            </Fab>

          </View>
          <View style={styles.button2Container}>
            <Fab
            style={{ backgroundColor: '#79e56a' }}
            position="bottomRight"
            onPress={() => this.props.navigation.navigate('PinInfo')}
            >
            <Icon name="checkmark" />
            </Fab>

          </View>


      </View>
    );
  }
}
