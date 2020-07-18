import { createStackNavigator } from 'react-navigation';
import SignInScreen from '../screens/auth/SignInScreen';

export default createStackNavigator(
  {
    SignIn: SignInScreen
  },
  {
    headerMode: 'none'
  }
);
