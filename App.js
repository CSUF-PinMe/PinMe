import React, { Component } from 'react';
import { Platform, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { Container, Item } from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import 'react-native-gesture-handler';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import { fromLeft, fromTop, fromRight } from 'react-navigation-transitions';
import * as Animatable from 'react-native-animatable';
import { Col, Grid } from 'react-native-easy-grid';
import Expo, { Location, Permissions } from 'expo';
import {authInfo} from './App.js'
import { Auth } from 'aws-amplify';
import Amplify from '@aws-amplify/core'
import awsmobile from './aws-exports'
Amplify.configure(awsmobile);

import createStore from 'pure-store';

import ConfirmCode from './src/components/confirmcode/confirmcode.component';
import ForgotPassword from './src/components/forgotpassword/forgotpassword.component';
import SignUp from './src/components/signup/signup.component';
import ChangePassword from './src/components/changepassword/changepassword.component';
// import TestMain from './testmain.component';
import SignIn from './src/components/signin/signin.component';
import MapNav from './router';

AnimatedLoading = Animatable.createAnimatableComponent(ActivityIndicator);
AnimatedItem = Animatable.createAnimatableComponent(Item);

export const store = createStore({
  initialMarkers: [],
  markers: [],
  currentUser: '',
  currentUserId: '',
  myMarkers: undefined,
  region: {
    latitude: 36.811998,
    longitude: -119.748398,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0221,
  },
  pinLink: {                // Used for map-link: opening pins in uber, lyft, waze, etc..
    name: undefined,
    latitude: undefined,
    longitude: undefined
  },
  pinInfo: {
    userId: '',
    eventName: '',
    eventType: 'General',
    description: '',
    startTime: '',
    endTime: '',
    latitude: undefined,
    longitude: undefined
  }
});

class Loading extends Component {
  constructor(props){
    super(props);

    this.state = {
        loading: true,
    };
  }

  static navigationOptions = {
    header: null
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    // console.log('User location: ', location.coords);
    store.update({
      userLocation: location.coords,
      region: {
        ...store.state.region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
    });
  };

  // Needed for Native-Base Buttons
  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    const session = Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(async (user) => {
      console.log('User is logged in:', user.username);

      this._getLocationAsync();
      await Auth.currentCredentials().then((response) => {
        console.log(response.data.IdentityId);
        store.update({
          currentUserId: response.data.IdentityId,
          currentUser: user.username
        });
      });

      setTimeout(() => {this.refs.title.bounceOutLeft();}, 500);
      setTimeout(() => {this.refs.loading.bounceOutLeft();}, 500);
      setTimeout(() => {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Map' }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      }, 1000);
    })
    .catch((err) => {
      console.log('Error:',err);
      setTimeout(() => {this.refs.title.bounceOutRight();}, 500);
      setTimeout(() => {this.refs.loading.bounceOutRight();}, 500);
      setTimeout(() => {this.props.navigation.navigate('SignIn');}, 1000);
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

        <Grid>
          <Col size={10.5} style={{ backgroundColor: '#03a9f4', justifyContent: 'center', alignItems: 'center'}}>
            <Animatable.Text ref="title" style={styles.title}>Loading</Animatable.Text>
            <AnimatedLoading ref="loading" style={{bottom: 50, backgroundColor: '#03a9f4'}} size="large" color="white"/>
          </Col>
        </Grid>
      </Container>
    );
  }
}

const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  // Custom transitions go there
  if (prevScene
    && prevScene.route.routeName === 'SignUp'
    && nextScene.route.routeName === 'ConfirmCode') {
    return fromTop();
  } else if (prevScene
    && prevScene.route.routeName === 'SignIn'
    && nextScene.route.routeName === 'ForgotPassword') {
    return fromTop();
  } else if (prevScene
    && prevScene.route.routeName === 'ForgotPassword'
    && nextScene.route.routeName === 'ChangePassword') {
    return fromRight();
  } else if (prevScene
    && prevScene.route.routeName === 'Loading'
    && nextScene.route.routeName === 'SignIn') {
    return fromLeft();
  } else if (prevScene
    && prevScene.route.routeName === 'Loading'
    && nextScene.route.routeName === 'Map') {
    return fromRight();
  } else if (prevScene
    && prevScene.route.routeName === 'SignIn'
    && nextScene.route.routeName === 'Map') {
    return fromRight();
  }

  return fromLeft();
};

const MainNavigator = createStackNavigator(
  {
    Loading: {screen: Loading},
    // Test: {screen: TestMain},
    SignIn: {screen: SignIn},
    SignUp: {screen: SignUp},
    ConfirmCode: {screen: ConfirmCode},
    ForgotPassword: {screen: ForgotPassword},
    ChangePassword: {screen: ChangePassword},
    Map: MapNav,
  },
  {
    initialRoute: 'Loading',
    transitionConfig: (nav) => handleCustomTransition(nav),
    navigationOptions: {
      headerVisible: false,
    }
  },
);

const AppContainer = createAppContainer(MainNavigator);
export default AppContainer;

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 60,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'sans-serif-thin',
    fontWeight: Platform.OS === 'ios' ? "100" : 'normal',
    bottom: 70
  },

});
