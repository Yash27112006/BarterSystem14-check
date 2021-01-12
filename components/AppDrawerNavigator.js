import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu  from './CustomSideBarMenu';
import MyBartersScreen from '../screens/MyBartersScreen';
import SettingScreen from '../screens/SettingScreen';
import NotificationScreen from '../screens/NotificationsScreen';
import {Icon} from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator,
    navigationOptions: {
      drawerIcon: <Icon name = "home" type = 'fontawesome5'/>,
    }
    },
  MyBarters:{
      screen : MyBartersScreen,
      navigationOptions: {
        drawerIcon: <Icon name = "gift" type = 'font-awesome'/>,
      }
    },
  Notifications :{
    screen : NotificationScreen,
    navigationOptions: {
      drawerIcon: <Icon name = "bell" type = 'font-awesome'/>,
    }
  },
    Setting : {
      screen : SettingScreen,
      navigationOptions: {
        drawerIcon: <Icon name = "settings" type = 'fontawesome5'/>,
      }
    }
},
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })