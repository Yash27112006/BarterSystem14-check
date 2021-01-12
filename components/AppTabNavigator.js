import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator'
import Exchange from '../screens/Exchange';
import {Input, Icon} from 'react-native-elements';
import {RFValue} from 'react-native-responsive-fontsize';

export const AppTabNavigator = createBottomTabNavigator({
  HomeScreen : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarIcon :   <Image source={require("../assets/donate.jpg")} style={{width:RFValue(20), height:RFValue(20)}}/>,
      tabBarLabel : "HomeScreen",
    }
  },
  ItemRequest: {
    screen: Exchange,
    navigationOptions :{
      tabBarIcon :<Image source={require("../assets/request.jpg")} style={{width:RFValue(20), height:RFValue(20),}} />,
      tabBarLabel : "Exchange",
    }
  }
});