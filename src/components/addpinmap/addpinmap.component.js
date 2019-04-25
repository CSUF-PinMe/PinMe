import { Button, Text, Icon, Item, Label, Input, Picker, Textarea} from 'native-base';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateTimePicker from "react-native-modal-datetime-picker";
import ImageViewer from 'react-native-image-zoom-viewer';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Modal from "react-native-modalbox";
import { Platform, TouchableHighlight, Alert, ActivityIndicator } from 'react-native';
import uuidv1 from 'uuid/v1';
import {Modal as ImageModal, AlertIOS} from 'react-native';
import ActionButton from 'react-native-action-button';
import styles from './addpinmap.style.js';
import myMapStyle from '../map/mapstyle';
import Expo, { Permissions, ImagePicker } from 'expo';
import API, { graphqlOperation } from '@aws-amplify/api'
import { Storage } from 'aws-amplify';
import * as mutations from '../../graphql/mutations';
import redPin from '../../../assets/pin_red.png'
import grayPin from '../../../assets/pin_gray.png'
import React, { Component } from 'react';
import {store} from '../../../App'
import { View, StatusBar, Dimensions, Image } from 'react-native';
import moment from 'moment'

var {height, width} = Dimensions.get('window');

export default class AddPinMap extends Component {
  constructor(props){
    super(props);

    this.state ={
      isDateTimePickerVisible: false,
      createButtonDisabled: false,
      createPinLoading: false,
      pickerType: "date",
      loading: true,
      visible: false,
      imageViewer: false,
      mapHeight: height,
      selected2: undefined,
      image: undefined,
      startTimeButtonText: 'Start',
      endTimeButtonText: 'End',
      pinInfo: {
        id: undefined,
        userId: store.state.currentUser,
        userCognitoId: store.state.currentUserId,
        hasImage: false,
        eventName: '',
        eventType: 'General',
        description: '',
        startTime: undefined,
        endTime: undefined,
        latitude: undefined,
        longitude: undefined
      }
    };

    this.closeImageViewer = this.closeImageViewer.bind(this);
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      console.log('You need to give camera permissions to take a picture!');
    }
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      EvilIcons: require("native-base/Fonts/EvilIcons.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
      Feather: require("@expo/vector-icons/fonts/Feather.ttf"),
      FontAwesome: require('react-native-vector-icons/Fonts/FontAwesome.ttf'),
      Entypo: require('react-native-vector-icons/Fonts/Entypo.ttf'),
    });
    this.setState({ loading: false });
    // console.log(store.state.region)
  }

  static navigationOptions = {
    header: null
  };

  openModal = () => {
    this.setRegion();
    this.setState({visible: true});
    setTimeout(() => this.setState({mapHeight: height*.4}), 300);
  };

  closeModal = () => {
    this.setState({mapHeight: height});
    this.setState({visible: false})
  };

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

  checkInput(){
    let error = false;

    if(this.state.nameError || this.state.descError || this.state.sTimeError || this.state.eTimeError)
      return true;

    if (this.state.pinInfo.eventName.trim() === "") {
      this.setState(() => ({ nameError: "Pin name required" }));
      error = true;
    } else {
      this.setState(() => ({ nameError: null }));
    }

    if (this.state.pinInfo.description.trim() === "") {
      this.setState(() => ({ descError: "Description required" }));
      error = true;
    } else {
      this.setState(() => ({ descError: null }));
    }

    if (!this.state.pinInfo.startTime) {
      this.setState(() => ({ sTimeError: "Start time required" }));
      error = true;
    } else {
      this.setState(() => ({ sTimeError: null }));
    }
    if (!this.state.pinInfo.endTime) {
      this.setState(() => ({ eTimeError: "End time required" }));
      error = true;
    } else {
      this.setState(() => ({ eTimeError: null }));
    }

    return error;
  }

  resetPinInfo(){
    let blankPinInfo = {
      id: undefined,
      userId: store.state.currentUser,
      userCognitoId: store.state.currentUserId,
      hasImage: false,
      eventName: '',
      eventType: 'General',
      description: '',
      startTime: undefined,
      endTime: undefined,
      latitude: undefined,
      longitude: undefined
    };

    this.setState({
      image: undefined,
      startTimeButtonText: 'Start',
      endTimeButtonText: 'End',
      pinInfo: blankPinInfo
    });
  }

  async addPin(){
    this.setState({
      createButtonDisabled: true,
      createPinLoading: true
    });

    let pin = this.state.pinInfo;
    pin.id = 'pin-'+uuidv1();
    pin.createdAt = moment().format();

    console.log("Creating pin:", pin);

    await API.graphql(graphqlOperation(mutations.createPin, { input: pin }))
      .then(res => {
        if(this.state.image !== undefined)
          this.uploadImage(pin.id);

        this.setState({
          createButtonDisabled: false,
          createPinLoading: false,
        });

        AlertIOS.alert(
          'Pin Created!',
          'Your new pin has been successfully created!',
          [
            {
              text: 'Ok',
              onPress: () => {
                this.resetPinInfo();
                if(this.state.image !== undefined)
                  this.removeImage();
                this.closeModal();
                this.props.navigation.navigate('Map');
              }
            }
          ]
        );
    })
      .catch(err => {
        console.log("Create Pin Error: ", err);
        this.setState({
          createButtonDisabled: false,
          createPinLoading: false
        });
      })
  }

  uploadImage(pinId){
    var image = this.state.image;
    const imageName = pinId+'.jpg';
    console.log('Uploading image: '+imageName);

    const fileType = 'image/jpg';
    const access = { level: "protected", contentType: fileType };

    fetch(image).then(response => {
      response.blob()
        .then(async blob => {
          await Storage.put(imageName, blob, access)
            .then(succ => {
              console.log("Image upload success: ", succ);
            })
            .catch(err => {
              console.log("Image upload encountered an error: ", err);
            });
        });
    });
  }

  async selectImage(){
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [4, 3]
    }).then(result => {
      if(result.cancelled){
        console.log("User cancelled selecting an image.")
      } else {
        let imageList = [];
        imageList.push({
          url: result.uri
        });
        this.setState({
          image: result.uri,
          imageList,
          pinInfo: {
            ...this.state.pinInfo,
            hasImage: true
          }
        });
        console.log('Selected image and saved to:',result.uri);
      }
    }).catch(e => {
      console.log("Encountered an error when trying to select an image.", e);
    })
  }

  async takeImage() {
    await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3]
    }).then(result => {
      if(result.cancelled){
        console.log('User cancelled taking an image.')
      } else {
        let imageList = [];
        imageList.push({
          url: result.uri
        });
        this.setState({
          image: result.uri,
          imageList,
          pinInfo: {
            ...this.state.pinInfo,
            hasImage: true
          }
        });
        console.log('Took image and saved to:',result.uri);
      }
    })
    .catch(err => {
      console.log('Error in taking picture: '+err)
    });
  };

  removeImage() {
    console.log("Removing image...");
    this.setState({
      image: undefined,
      imageList: []
    });
  }

  closeImageViewer(){
    this.setState({
      imageViewer: false
    })
  }

  handleDatePicked = date => {

    if(this.state.currentTime === 'start'){
      console.log("Setting startTime to:", date.toLocaleString());
      this.setState({
        startTimeButtonText: date.toLocaleString(),
        sTimeError: null,
        pinInfo: {
            ...this.state.pinInfo,
            startTime: date
          }
      });
    } else if(this.state.currentTime === 'end'){
      console.log("Setting endTime to:", date.toLocaleString());
      this.setState({
        endTimeButtonText: date.toLocaleString(),
        eTimeError: null,
        pinInfo: {
          ...this.state.pinInfo,
          endTime: date
        }
      });
    }
    this.hideDateTimePicker();
  };

  showDateTimePicker = (time) => this.setState({ isDateTimePickerVisible: true, currentTime: time });
  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  render() {

    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar hidden={Platform.OS !== 'ios'} />
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
            fixNativeFeedbackRadius={Platform.OS !== 'ios'}
            renderIcon={() => { return ( <Icon name="close" style={styles.actionButtonIcon} /> ); }}
            onPress={() => this.props.navigation.goBack()}
            position="left"
            offsetX={15}
            offsetY={15}
          />

          <ActionButton
            buttonColor="#79e56a"
            fixNativeFeedbackRadius={Platform.OS !== 'ios'}
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
            swipeArea={height*.5} // The height in pixels of the swipeable area, window height by default
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
                extraScrollHeight={100}
                >
                  <Item style={{borderColor: 'transparent'}}>
                    <Label style={styles.label}>Pin Name: </Label>
                    <Input
                      style={styles.input}
                      onChangeText={(e) => {
                        this.handleChange('eventName', e);
                        if(e.trim() !== "") {this.setState(() => ({ nameError: null }));}
                      }}
                      placeholderTextColor='#017BB0' placeholder="name of pin"/>
                  </Item>
                  {!!this.state.nameError && (
                    <Label style={[styles.label, {fontSize: 18, top: 0, left: 12, color: 'red'}]}>{this.state.nameError}</Label>
                  )}
                  <Item style={{borderColor: 'transparent'}}>
                    <Label style={styles.label}>Description: </Label>
                  </Item>
                  {!!this.state.descError && (
                    <Label style={[styles.label, {fontSize: 18, top: 5, left: 12, color: 'red'}]}>{this.state.descError}</Label>
                  )}
                  <Item style={{borderColor: 'transparent'}}>
                  <Textarea
                    rowSpan={2}
                    onChangeText={(e) => {
                      this.handleChange('description', e);
                      if(e.trim() !== "") {this.setState(() => ({ descError: null }));}
                    }}
                    style={{width: width, paddingHorizontal: 5, top: 5, fontSize: 18, color: 'white', fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin'}} placeholderTextColor='#017BB0' placeholder="description of pin" />
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
                    <Label style={styles.label}>Date and Time</Label>
                  </Item>
                  <Item style={{borderColor: 'transparent', top: 15, justifyContent: 'center'}}>
                    <Button
                      iconLeft
                      style={{backgroundColor: 'white'}}
                      onPress={() => {
                        this.showDateTimePicker("start")
                      }}>
                      <Icon name="calendar" type="EvilIcons" style={{ color: '#03a9f4', fontSize: 32}}/>
                      <Text style={styles.buttonText}>{this.state.startTimeButtonText}</Text>
                    </Button>
                  </Item>
                  {!!this.state.sTimeError && (
                    <Label style={[styles.label, {fontSize: 18, top: 15, alignSelf: 'center', color: 'red'}]}>{this.state.sTimeError}</Label>
                  )}
                  <Item style={{borderColor: 'transparent', top: 25, justifyContent: 'center'}}>
                    <Text style={{color: 'white', fontFamily: 'HelveticaNeue-Light'}}>To</Text>
                  </Item>
                  <Item style={{borderColor: 'transparent', top: 35, justifyContent: 'center'}}>
                    <Button
                      iconLeft
                      style={{backgroundColor: 'white'}}
                      onPress={() => {
                        this.showDateTimePicker("end")
                      }}>
                      <Icon name="calendar" type="EvilIcons" style={{ color: '#03a9f4', fontSize: 32}}/>
                      <Text style={styles.buttonText}>{this.state.endTimeButtonText}</Text>
                    </Button>
                  </Item>
                  {!!this.state.eTimeError && (
                    <Label style={[styles.label, {fontSize: 18, top: 40, alignSelf: 'center', color: 'red'}]}>{this.state.eTimeError}</Label>
                  )}
                  <Item style={{borderColor: 'transparent', top: 35}}>
                    <Label style={styles.label}>Image</Label>
                  </Item>
                  {this.state.image === undefined ?
                    <Grid>
                      <Col>
                        <Row style={{justifyContent: 'space-around'}}>
                          <View style={{paddingTop: 50}}>
                            <Button iconLeft onPress={() => this.takeImage()} style={{backgroundColor: 'white'}}>
                              <Icon name="camera" type="EvilIcons" style={{color: '#03a9f4', fontSize: 32}}/>
                              <Text style={styles.buttonText}>Take Image</Text>
                            </Button>
                          </View>
                          <View style={{paddingTop: 50}}>
                            <Button iconLeft onPress={() => this.selectImage()} style={{backgroundColor: 'white'}}>
                              <Icon name="image" type="EvilIcons" style={{color: '#03a9f4', fontSize: 32}}/>
                              <Text style={styles.buttonText}>Select Image</Text>
                            </Button>
                          </View>
                        </Row>
                      </Col>
                    </Grid>
                    :
                    <Item style={{borderColor: 'transparent', top: 50}}>
                      <Grid>
                        <Col>
                          <Row style={{justifyContent: 'center'}}>
                            <Button iconLeft
                              style={{backgroundColor: 'white', minWidth: 100}}
                              onPress={() => Alert.alert(
                                'Removing Image',
                                'Are you sure you want to remove the image?',
                                [
                                  {text: 'OK', onPress: () => {
                                      this.removeImage();
                                    }},
                                  {text: 'Cancel', onPress: () => {return}, style: 'cancel'},
                                ]
                              )}
                            >
                              <Icon style={{color: '#03a9f4', fontSize: 32}} name="close-o" type="EvilIcons"/>
                              <Text style={styles.buttonText}>Remove Image</Text>
                            </Button>
                          </Row>
                          <Row style={{justifyContent: 'center'}}>
                            <TouchableHighlight
                            onPress={() => {
                              console.log("Opening image viewer");
                              this.setState({imageViewer: true});
                            }}
                            >
                              <Image
                                source={{uri: this.state.image}}
                                style={{width: 300, height: 300, top: 15}}
                              />
                            </TouchableHighlight>
                          </Row>
                        </Col>
                      </Grid>
                    </Item>
                  }
                  <Item style={{borderColor: 'transparent', paddingTop: 100}}>
                    <Grid>
                      <Row style={{ backgroundColor: '#03a9f4', justifyContent: 'space-around'}}>
                        <Button iconLeft large
                          ref="leftbutton"
                                onPress={() => Alert.alert(
                                  'Canceling Pin',
                                  'Are you sure you want to cancel this pin?',
                                  [
                                    {text: 'OK', onPress: () => {
                                        this.closeModal();
                                        this.props.navigation.navigate('Map');
                                      }},
                                    {text: 'Cancel', onPress: () => {return null}, style: 'cancel'},
                                  ]
                                )}
                          style={styles.leftButton}
                          >
                          <Icon name="close-o" type="EvilIcons" style={{color: '#03a9f4', fontSize: 32}}/>
                          <Text style={styles.buttonText}>Cancel</Text>
                        </Button>

                        <Button iconLeft large
                          disabled={this.state.createButtonDisabled}
                          style={styles.rightButton}
                          onPress={() => {
                            if(this.checkInput()){
                              console.log('something is empty');
                            } else {
                              console.log('No empty fields!');
                              this.addPin();
                            }
                          }}>
                          {this.state.createPinLoading ? null : <Icon name="check" type="EvilIcons" style={{color: '#03a9f4', fontSize: 32}}/>}
                          {this.state.createPinLoading ?
                            <ActivityIndicator />
                            :
                            <Text style={styles.buttonText}>Create Pin</Text>
                            }
                        </Button>
                      </Row>
                    </Grid>
                  </Item>
                </KeyboardAwareScrollView>

              </Col>
            </Grid>
          </Modal>

          <ImageModal visible={this.state.imageViewer} transparent={true}>
            <ImageViewer
              enableSwipeDown
              onCancel={this.closeImageViewer}
              imageUrls={this.state.imageList}
            />
          </ImageModal>

          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode="datetime"
          />

      </View>
    );
  }
}

AddPinMap.propTypes = {
  provider: ProviderPropType,
};
