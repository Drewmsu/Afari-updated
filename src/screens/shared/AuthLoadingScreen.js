import React, { Component } from 'react';
import { View, StyleSheet, StatusBar, AsyncStorage } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import { WaveIndicator } from 'react-native-indicators';
import { colors } from '../../theme/appTheme';
import constants from '../../utils/constants';
import { urls } from '../../services/api/afari';

class AuthLoadingScreen extends Component {
  state = {
    resourcesReady: false
  };

  async _loadResourcesAsync() {
    return Promise.all([Asset.loadAsync([require('../../../assets/images/logo.png')])]);
  }

  _loginHandler = async () => {
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
          AsyncStorage.setItem(
            constants.building.apartmentId,
            String(parsedResponse.departamentoId)
          );
          AsyncStorage.setItem(
            constants.building.apartmentName,
            String(parsedResponse.nombreDepartamento)
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  _startAsyncTasks = async () => {
    await this._loadResourcesAsync();
    await this._loginHandler();
  };

  _handleLoadingError = (error) => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ resourcesReady: true });
  };

  _bootstrapAsync = async () => {
    const userId = parseInt(await AsyncStorage.getItem(constants.user.userId));
    if (userId != null && userId != undefined && typeof userId === 'number' && !isNaN(userId)) {
      const role = await AsyncStorage.getItem(constants.user.role);
      if (role === 'ADM') {
        this.props.navigation.navigate('Admin');
      } else if (role === 'PRO') {
        this.props.navigation.navigate('Owner');
      }
    } else {
      this.props.navigation.navigate('Auth');
    }
  };

  componentDidUpdate() {
    if (this.state.resourcesReady) {
      this._bootstrapAsync();
    }
  }

  render() {
    if (!this.state.resourcesReady) {
      return (
        <AppLoading
          startAsync={this._startAsyncTasks}
          onFinish={this._handleFinishLoading}
          onError={this._handleLoadingError}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <WaveIndicator color={colors.afariGreen} size={100} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background
  }
});

export default AuthLoadingScreen;
