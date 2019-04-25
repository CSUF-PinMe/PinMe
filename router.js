import { createDrawerNavigator, DrawerItems, SafeAreaView } from 'react-navigation';
import React, { Component } from 'react';
import 'react-native-gesture-handler';
import {StyleSheet, Image, View, Dimensions} from 'react-native';
import Expo from "expo";
import { fadeIn } from 'react-navigation-transitions';
import { Icon, Content, Header, Body, Footer, Button, Text} from 'native-base'

import MapScreen from './src/components/map/map.component';
import AddPinMap from './src/components/addpinmap/addpinmap.component';
import PinInfo from './src/components/pininfo/pininfo.component';
import SearchScreen from './src/components/search/search.component';
import MyPinsScreen from './src/components/mypins/mypins.component';

const { width, height } = Dimensions.get('window');

class CustomDrawerContentComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading: true
    }

  }

  async componentDidMount(){
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      FontAwesome: require("native-base/Fonts/FontAwesome.ttf"),
      EvilIcons: require("native-base/Fonts/EvilIcons.ttf"),
    });
    this.setState({loading: false});
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <SafeAreaView style = {{flex:1}} forceInset={{ top: 'always', horizontal: 'never' }}>
        <Image
          style={styles.drawerImage}
          source={require('./assets/icon.png')} />
        <DrawerItems {...this.props} style={{flex: 9}}/>
      </SafeAreaView>
    );
  }
}

const MapNav = createDrawerNavigator({
    Search: {
      screen: SearchScreen,
      navigationOptions: {
      drawerIcon: <Icon name = "search" style = {{fontSize: 24, color:'red'}} />
      }
    },

    Map: {
      screen: MapScreen,
      navigationOptions: {
        drawerIcon: <Icon name = "home" style = {{fontSize: 24, color: 'red'}} />,
        header: null
      }
    },

    MyPins: {
      screen: MyPinsScreen,
      navigationOptions: {
        drawerIcon: <Icon name='ios-pin' style = {{color:'red'}} />
      }
    },
    AddPin:{
      screen: AddPinMap,
      navigationOptions: {
      drawerLabel: ()=>null
      }
    },
    PinInfo: {
      screen: PinInfo,
      navigationOptions: {
      drawerLabel: ()=>null
      }
    },
    SignOut: {
      screen: MapScreen,
      navigationOptions: {
        title: "Sign Out",
      },
      contentOptions: {
        onItemPress: (route) => {
          console.log("Sign out Button was pressed!")
        },
        itemStyle: {
          bottom: 0
        }
      }
    }
},
{
  initialRouteName: 'Map',
  transitionConfig: () => fadeIn(),
  drawerPosition: 'left',
  drawerWidth: width*.6,
  headerMode: 'screen',
  useNativeAnimations: true,
  contentComponent: CustomDrawerContentComponent,
  contentOptions: {
    activeTintColor: '#03a9f4',
    inactiveTintColor: '#9e9e9e',
  },
  navigationOptions: {
    header: null,
  }
}, {});

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    drawerHeader: {
      height: 200,
      backgroundColor: 'white',
      alignItems: 'center'
    },
    drawerImage: {
      height: 150,
      width: 150,
      borderRadius: 75,
      alignSelf: 'center'
    }
});

export default MapNav;
