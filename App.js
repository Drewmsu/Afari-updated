import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { Asset } from 'react-native-unimodules';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import RootNavigator from './src/navigation/RootNavigator';
import { appTheme } from './src/theme/appTheme';
import constants from './src/utils/constants';
import { urls } from './src/services/api/afari';

const AppContainer = createAppContainer(RootNavigator);

export default class App extends Component {
  state = {
    appIsReady: false
  };

  async componentDidMount() {
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
    this.prepareResources();
  }

  prepareResources = async () => {
    await performAPICalls();
    await downloadAssets();

    this.setState({ appIsReady: true }, async () => {
      await SplashScreen.hideAsync();
    });
  };

  render() {
    if (!this.state.appIsReady) {
      return null;
    }

    return (
      <PaperProvider theme={appTheme}>
        <AppContainer />
      </PaperProvider>
    );
  }
}

async function performAPICalls() {
  await _loginHandler();
}

async function downloadAssets() {
  return Promise.all([Asset.loadAsync([require('./assets/images/logo.png')])]);
}

async function _loginHandler() {
  const userCredentials = {
    username: await AsyncStorage.getItem(constants.user.username),
    password: await AsyncStorage.getItem(constants.user.password)
  };
  await fetch(urls.login, {
    method: 'POST',
    body: JSON.stringify({
      usuario: userCredentials.username,
      password: userCredentials.password
    }),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
  })
    .then((response) => response.json())
    .then((parsedResponse) => {
      if (parsedResponse.error) {
        console.log(parsedResponse.mensaje);
      } else {
        AsyncStorage.setItem(constants.user.userId, String(parsedResponse.usuarioId));
        AsyncStorage.setItem(constants.user.role, String(parsedResponse.rol));
        AsyncStorage.setItem(constants.user.email, String(parsedResponse.correo));
        AsyncStorage.setItem(constants.user.name, String(parsedResponse.nombre));
        AsyncStorage.setItem(constants.user.lastPayment, String(parsedResponse.ultimaPagada));
        AsyncStorage.setItem(constants.building.id, String(parsedResponse.edificioId));
        AsyncStorage.setItem(constants.building.name, String(parsedResponse.nombreEdificio));
        AsyncStorage.setItem(constants.building.apartmentId, String(parsedResponse.departamentoId));
        AsyncStorage.setItem(
          constants.building.apartmentName,
          String(parsedResponse.nombreDepartamento)
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
