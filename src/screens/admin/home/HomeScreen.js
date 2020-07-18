import React, { Component } from 'react';
import { View, StyleSheet, AsyncStorage, Alert } from 'react-native';
import { Searchbar, List, Divider, IconButton } from 'react-native-paper';
import { SearchableFlatList } from 'react-native-searchable-list';
import { WaveIndicator } from 'react-native-indicators';
import { colors } from '../../../theme/appTheme';
import { urls } from '../../../services/api/afari';
import constants from '../../../utils/constants';

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Inicio',
    headerRight: <IconButton icon="reply" onPress={navigation.getParam('logout')} />
    // headerLeft: <Button icon="dehaze" onPress={() => navigation.toggleDrawer()} />
  });

  state = {
    isLoading: false,
    searchTerm: '',
    searchAttribute: 'nombre',
    ignoreCase: true,
    buildings: []
  };

  getData = async () => {
    this.setState({ isLoading: true });
    let userId = await AsyncStorage.getItem(constants.user.userId);
    let url = `${urls.getEdificios}?usuarioId=${userId}`;
    fetch(url)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          this.setState({
            buildings: parsedRes.lstEdificios
          });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });

    this.setState({ isLoading: false });
  };

  goToHomeMenu = (item) => {
    this.props.navigation.navigate('HomeMenu', {
      buildingId: item.edificioId,
      buildingName: item.nombre
    });
  };

  _signoutHandler = async () => {
    await AsyncStorage.clear();
    //Fetch Logout
    this.props.navigation.navigate('Auth');
  };

  _signoutPressHandler = () => {
    Alert.alert('Cerrar Sesión', '¿Está seguro de cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aceptar',
        onPress: () => this._signoutHandler()
      }
    ]);
  };

  componentDidMount() {
    this.props.navigation.setParams({ logout: this._signoutPressHandler });
    this.getData();
  }

  render() {
    const { buildings, searchTerm, searchAttribute, ignoreCase } = this.state;

    return !this.state.isLoading ? (
      <View style={styles.container}>
        <Searchbar
          placeholder="Buscar Edificio"
          style={styles.searchbar}
          onChangeText={(searchTerm) => {
            this.setState({ searchTerm });
          }}
          value={searchTerm}
        />
        <SearchableFlatList
          data={buildings}
          searchTerm={searchTerm}
          searchAttribute={searchAttribute}
          ignoreCase={ignoreCase}
          renderItem={({ item }) => (
            <View>
              <List.Item
                title={item.nombre}
                onPress={() => this.goToHomeMenu(item)}
                right={(props) => (
                  <List.Icon
                    {...props}
                    color={colors.afariGreen}
                    style={styles.listItemIcon}
                    icon="arrow-forward"
                  />
                )}
              />
              <Divider />
            </View>
          )}
          keyExtractor={(item) => `${item.edificioId}`}
        />
      </View>
    ) : (
      <View style={styles.loadingContainer}>
        <WaveIndicator color={colors.afariGreen} size={100} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  searchbar: {
    margin: 5
  },
  listItemIcon: {
    margin: 0
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default HomeScreen;
