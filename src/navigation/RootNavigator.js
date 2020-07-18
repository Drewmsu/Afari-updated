import { createSwitchNavigator } from 'react-navigation';
import AdminApp from './AdminApp';
import OwnerApp from './OwnerApp';
import AuthNavigator from './AuthNavigator';
import AuthLoadingScreen from '../screens/shared/AuthLoadingScreen';
//Add another screen import to and replace the initialroute name for faster development
//import CloseFeeScreen from '../screens/admin/CloseFeesScreen';

const RootNavigator = createSwitchNavigator(
  {
    //Only use Test for development
    //Test: CloseFeeScreen,
    AuthLoading: AuthLoadingScreen,
    Auth: AuthNavigator,
    Admin: AdminApp,
    Owner: OwnerApp
  },
  {
    initialRouteName: 'AuthLoading'
  }
);

export default RootNavigator;
