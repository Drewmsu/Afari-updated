import React, { Component } from 'react';
import {
  AsyncStorage,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  View,
  StyleSheet,
  Image
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { scale, scaleVertical } from '../../utils/scale';
import { colors } from '../../theme/appTheme';

import logo from '../../../assets/images/logo.png';
import { urls } from '../../services/api/afari';
import constants from '../../utils/constants';

class SignInScreen extends Component {
  state = {
    isLoading: false,
    username: '',
    password: ''
  };

  _loginHandler = async () => {
    this.setState({ isLoading: true });
    await fetch(urls.login, {
      method: 'POST',
      body: JSON.stringify({
        usuario: this.state.username,
        password: this.state.password
      }),
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    })
      .then((response) => response.json())
      .then((parsedResponse) => {
        if (parsedResponse.error) {
          alert(parsedResponse.mensaje);
          this.setState({ isLoading: false });
        } else {
          AsyncStorage.setItem(constants.user.userId, String(parsedResponse.usuarioId));
          AsyncStorage.setItem(constants.user.role, String(parsedResponse.rol));
          AsyncStorage.setItem(constants.user.email, String(parsedResponse.correo));
          AsyncStorage.setItem(constants.user.name, String(parsedResponse.nombre));
          AsyncStorage.setItem(constants.user.lastPayment, String(parsedResponse.ultimaPagada));
          AsyncStorage.setItem(constants.user.username, String(this.state.username));
          AsyncStorage.setItem(constants.user.password, String(this.state.password));
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

          if (parsedResponse.rol === 'ADM') {
            this.props.navigation.navigate('Admin');
          } else if (parsedResponse.rol === 'PRO') {
            this.props.navigation.navigate('Owner');
          } else {
            alert(
              'Rol incorrecto',
              'Usuario no identificado correctamente. Por favor vuelva a iniciar sesión.'
            );
            this.setState({ isLoading: false });
          }
        }
      })
      .catch((error) => {
        alert('Error al iniciar sesión', 'Ha ocurrido un error al procesar la solicitud: ' + error);
        this.setState({ isLoading: false });
      });
  };

  render() {
    return !this.state.isLoading ? (
      <KeyboardAvoidingView style={styles.screen} behavior="padding">
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={logo} resizeMode="contain" />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              mode="flat"
              label="Usuario"
              placeholder="Ingrese su usuario"
              style={styles.input}
              onChangeText={(text) => this.setState({ username: text })}
              value={this.state.username}
              autoCorrect={false}
            />
            <TextInput
              mode="flat"
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              style={styles.input}
              onChangeText={(text) => this.setState({ password: text })}
              value={this.state.password}
              autoCorrect={false}
              secureTextEntry
            />
            <Button
              style={styles.signInButtom}
              mode="outlined"
              onPress={() => this._loginHandler()}>
              Iniciar Sesión
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    ) : (
      <View style={styles.loadingContainer}>
        <WaveIndicator color={colors.afariGreen} size={100} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
  },
  container: {
    width: '100%',
    height: '75%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoContainer: {
    flex: 1,
    width: '80%'
  },
  logo: {
    width: '100%',
    height: '100%'
  },
  inputContainer: {
    flex: 2,
    width: '100%',
    paddingHorizontal: scale(16)
  },
  input: {
    marginTop: scaleVertical(10),
    backgroundColor: 'transparent'
  },
  signInButtom: {
    backgroundColor: 'transparent',
    marginTop: scaleVertical(25),
    borderColor: 'white',
    color: 'white',
    borderRadius: 5
  }
});

export default SignInScreen;
