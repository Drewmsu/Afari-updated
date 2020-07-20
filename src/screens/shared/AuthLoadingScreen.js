import React, { Component } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { WaveIndicator } from 'react-native-indicators';
import { colors } from '../../theme/appTheme';
import constants from '../../utils/constants';

class AuthLoadingScreen extends Component {
  async componentDidMount() {
    await this._bootstrapAsync();
  }

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

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <WaveIndicator color={colors.afariGreen} size={100} />
      </View>
    );
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
