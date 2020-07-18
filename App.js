import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { Provider as PaperProvider } from 'react-native-paper';
import RootNavigator from './src/navigation/RootNavigator';
import { appTheme } from './src/theme/appTheme';

const AppContainer = createAppContainer(RootNavigator);

export default class App extends Component {
  render() {
    return (
      <PaperProvider theme={appTheme}>
        <AppContainer />
      </PaperProvider>
    );
  }
}
