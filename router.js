import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import React from 'react';
import { StyleSheet, Image, SafeAreaView } from 'react-native';
import { fadeIn } from 'react-navigation-transitions';
import { Icon, Content, Header, Body} from 'native-base'

import MapScreen from './src/components/map/map.component';
import AddPinMap from './src/components/addpinmap/addpinmap.component';
import PinInfo from './src/components/pininfo/pininfo.component';
import SearchScreen from './src/components/search/search.component';
import MyPinsScreen from './src/components/mypins/mypins.component';

const CustomDrawerContentComponent = (props) => (

  <SafeAreaView style = {{flex:1}}>
    <Header style={styles.drawerHeader}>
      <Body>
        <Image
          style={styles.drawerImage}
          source={require('./assets/icon.png')} />
      </Body>
    </Header>
    <Content>
      <DrawerItems {...props} />
    </Content>
  </SafeAreaView>

);

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
    }
},
{
  initialRouteName: 'Map',
  transitionConfig: () => fadeIn(),
  drawerPosition: 'left',
  headerMode: 'screen',
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
