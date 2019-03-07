import { Container, Header, Content, Button, Text, Icon, Fab, Footer, Item, Label, Input, Picker, Textarea} from 'native-base';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Col, Row, Grid } from 'react-native-easy-grid';
import Modal from "react-native-modalbox";
import { Platform, KeyboardAvoidingView } from 'react-native';
import ActionButton from 'react-native-action-button';
import styles from './addpinmap.component.style.js';
import myMapStyle from '../map/mapstyle';
import Expo, { Constants, Location, Permissions, ImagePicker } from 'expo';
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
      visible: false,
      mapHeight: height,
      selected2: undefined,
      pinInfo: {
        userId: store.state.currentUser,
        eventName: undefined,
        eventType: undefined,
        description: undefined,
        startTime: undefined,
        endTime: undefined,
        latitude: undefined,
        longitude: undefined
      }
    };
  }

  async componentDidMount() {
    const { status, expires, permissions } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
    if (status !== 'granted') {
      console.log('You need to give camera permissions to take a picture!');
    }
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

  takeSnapshot () {
    // 'takeSnapshot' takes a config object with the
    // following options
    const snapshot = this.map.takeSnapshot({
      width: 300,      // optional, when omitted the view-width is used
      height: 300,     // optional, when omitted the view-height is used
      region: store.state.region,    // iOS only, optional region to render
      format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
      quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
      result: 'file'   // result types: 'file', 'base64' (default: 'file')
    });
    snapshot.then((uri) => {
      this.props.navigation.navigate('PinInfo', {snapshot: uri});
    });
  }

  openModal = () => {
    this.setRegion();
    this.setState({visible: true});
    setTimeout(() => this.setState({mapHeight: height*.4}), 300);
  }

  closeModal = () => {
    this.setState({mapHeight: height});
    this.setState({visible: false})
  }

  setRegion(){
    this.setState({
      pinInfo: {
        ...this.state.pinInfo,
        latitude: store.state.region.latitude,
        longitude: store.state.region.longitude
      }
    })
  }

  handleChange(name, value){
    // console.log(name, ' is now ', value);
    this.setState({
      pinInfo: {
        ...this.state.pinInfo,
        [name]: value
      }
    });
  }

  onValueChange2(value: string) {
    this.setState({
      pinInfo: {
        ...this.state.pinInfo,
        eventType: value
      }
    });
  }

  addPin() {
    console.log('Pin Info: ', this.state.pinInfo);

    // if(this.checkInput() === false){
    //   console.log('something is empty');
    // } else {
    //   console.log('no empty fields!');
      const newPin = API.graphql(graphqlOperation(mutations.createPin,
        {
          input: this.state.pinInfo
        }
      ));
      this.closeModal();
      this.props.navigation.navigate('Map');
    // }
  }

  takeImage() {
    let result =  ImagePicker.launchCameraAsync({
      allowsEditing: false,
      base64: true,
      aspect: [4, 3]
    });
    this.setState({image: result.uri});
    console.log(result);
  };

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar hidden={Platform.OS === 'ios' ? false : true} />
          <View style={styles.container}>
            <MapView
              ref = {(ref)=>this.map=ref}
              provider={this.props.provider}
              style={{height: this.state.mapHeight, width: width}}
              onRegionChange={(region) => {
                // console.log('Add Pin Map Region: ', region);
                store.update({region});
              }}
              region={store.state.region}
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

          <View pointerEvents="none" style={{width: width, height: this.state.mapHeight, position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
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
            onPress={() => {
              this.openModal();
            }}
            offsetX={15}
            offsetY={15}
          />

          <Modal
            position={"bottom"}
            style={{ height: height*.6, width: width, backgroundColor: '#03a9f4', borderRadius: 10, borderColor: 'transparent', borderWidth: 2}}
            keyboardTopOffset={height*.4}
            swipeToClose={false}
            swipeArea={height*.6} // The height in pixels of the swipeable area, window height by default
            swipeThreshold={50} // The threshold to reach in pixels to close the modal
            isOpen={this.state.visible}
            onClosed={this.closeModal}
            backdropOpacity={0}
          >
            <Grid>
              <Col size={9}>
                <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={{backgroundColor: '#03a9f4'}}
                scrollEnabled={true}
                >
                  <Item style={{borderColor: 'transparent'}}>
                    <Label style={styles.label}>Pin Name: </Label>
                    <Input style={styles.input} onChangeText={(e) => {this.handleChange('eventName', e);}} placeholderTextColor='#017BB0' placeholder="name of pin"/>
                  </Item>
                  <Item style={{borderColor: 'transparent'}}>
                    <Label style={styles.label}>Description: </Label>
                  </Item>
                  <Item style={{borderColor: 'transparent'}}>
                  <Textarea rowSpan={3} onChangeText={(e) => {this.handleChange('description', e);}} style={{width: width, paddingHorizontal: 5, top: 5, fontSize: 18, color: 'white', fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin'}} placeholderTextColor='#017BB0' placeholder="description of pin" />
                  </Item>
                  <Item style={{borderColor: 'transparent'}}>
                    <Label style={styles.label}>Type: </Label>
                    <Item style={{borderBottomWidth:1, borderColor: '#03a9f4'}} picker>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon style={{color: 'white'}} name="arrow-down" />}
                        style={{ width: undefined, top: 12, left: 0}}
                        placeholder="Select the type of pin"
                        placeholderStyle={{ color: "#017BB0" }}
                        placeholderIconColor="white"
                        textStyle={{ color: "white", left: 0, fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin'}}
                        selectedValue={this.state.pinInfo.eventType}
                        onValueChange={this.onValueChange2.bind(this)}
                      >
                        <Picker.Item label="General" value="General" />
                        <Picker.Item label="Accident" value="Accident" />
                        <Picker.Item label="Food" value="Food" />
                        <Picker.Item label="Social" value="Social" />
                        <Picker.Item label="Study" value="Study" />
                      </Picker>
                    </Item>
                  </Item>
                  <Item style={{borderColor: 'transparent'}}>
                    <Label style={styles.label}>Start Time: </Label>
                    <Input style={styles.input} onChangeText={(e) => this.handleChange('startTime', e)} placeholderTextColor='#017BB0' placeholder="start time"/>
                  </Item>
                  <Item style={{borderColor: 'transparent'}}>
                    <Label style={styles.label}>End Time: </Label>
                    <Input style={styles.input} onChangeText={(e) => this.handleChange('endTime', e)} placeholderTextColor='#017BB0' placeholder="end time"/>
                  </Item>
                  <Row>
                  <ActionButton
                    buttonColor="white"
                    fixNativeFeedbackRadius={Platform.OS === 'ios' ? true : false}
                    renderIcon={() => { return ( <Icon name="ios-camera" style={styles.actionButtonIcon} /> ); }}
                    onPress={() => this.takeImage()}
                    offsetX={width-30}
                  />
                  {this.state.image ? <Image source={{uri: `${this.state.image}`}} style={{ transform: [{ scale: .35 }] }}/> : null}
                  </Row>
                </KeyboardAwareScrollView>
              </Col>

              <Row size={1} style={{ backgroundColor: '#03a9f4', justifyContent: 'space-around', bottom: Platform.OS === 'ios' ? 15 : 10}}>
                <Button large
                  ref="leftbutton"
                  onPress={() => {
                    this.closeModal();
                    this.props.navigation.navigate('Map');
                  }}
                  style={styles.leftButton}
                  >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Button>

                <Button large
                  style={styles.rightButton}
                  onPress={() => this.addPin()}>
                  <Text style={styles.buttonText}>Create Pin</Text>
                </Button>
              </Row>
            </Grid>
          </Modal>
      </View>
    );
  }
}

AddPinMap.propTypes = {
  provider: ProviderPropType,
}
