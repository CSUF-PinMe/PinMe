import { Container, Header, Content, Button, Text, Icon, Fab, Footer} from 'native-base';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import { Platform } from 'react-native';
import ActionButton from 'react-native-action-button';
import styles from './addpinmap.component.style.js';
import myMapStyle from '../map/mapstyle';
import Expo, { Constants, Location, Permissions } from 'expo';
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
        <StatusBar hidden={Platform.OS === 'ios' ? false : true} />
          <View style={styles.container}>
            <MapView
            provider={this.props.provider}
            style={styles.map}
            onRegionChange={(region) => store.update({region})}
            initialRegion={store.state.region}
            customMapStyle={myMapStyle}
            showsUserLocation={true}
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

          <View pointerEvents="none" style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 40, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={redPin} style={{transform: [{ scale: .35 }]}}/>
          </View>

          <ActionButton
          buttonColor="#ed2224"
          fixNativeFeedbackRadius={Platform.OS === 'ios' ? true : false}
          renderIcon={() => { return ( <Icon name="close" style={styles.actionButtonIcon} /> ); }}
          onPress={() => this.props.navigation.goBack()}
          position="left"
          offsetX={15}
          offsetY={15}
          />

          <ActionButton
          buttonColor="#79e56a"
          fixNativeFeedbackRadius={Platform.OS === 'ios' ? true : false}
          renderIcon={() => { return ( <Icon name="checkmark" style={styles.actionButtonIcon} /> ); }}
          onPress={() => this.props.navigation.navigate('PinInfo')}
          offsetX={15}
          offsetY={15}
          />

      </View>
    );
  }
}

AddPinMap.propTypes = {
  provider: ProviderPropType,
}
