import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from '../screens/LoginScreen';
import ChatScreen from '../screens/ChatScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddFriendScreen from '../screens/AddFriendScreen';

const AppNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    Home: HomeScreen,
    Chat: ChatScreen,
    Profile: ProfileScreen,
    AddFriend: AddFriendScreen
  },
  {
    headerMode: "none"
  }
);

export default createAppContainer(AppNavigator);