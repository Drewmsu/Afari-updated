import React, { Component } from 'react';
import { ScrollView, StyleSheet, AsyncStorage, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Drawer, Divider } from 'react-native-paper';
import { colors } from '../theme/appTheme';

const routes = [{ key: 0, label: 'Inicio', icon: 'home', route: 'Home' }];

class AdminSideBar extends Component {
  state = {
    selectedIndex: 0
  };

  _onItemPressed = (index, route) => {
    this.setState({ selectedIndex: index });
    this.props.navigation.navigate(route);
  };

  _signoutHandler = async () => {
    await AsyncStorage.clear();
    //Fetch Logout
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
          {routes.map((props, index) => (
            <View key={props.key}>
              <Drawer.Item
                {...props}
                active={this.state.selectedIndex === index}
                theme={{ colors: { primary: colors.selectedItemDrawer } }}
                onPress={() => this._onItemPressed(index, props.route)}
              />
              <Divider />
            </View>
          ))}
        </SafeAreaView>
        <Drawer.Item label="Cerrar Sesión" icon="reply" onPress={() => this._signoutHandler()} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default AdminSideBar;
