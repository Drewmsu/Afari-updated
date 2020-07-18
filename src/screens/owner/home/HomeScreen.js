import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, List, Surface, IconButton } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import constants from '../../../utils/constants';
import { colors } from '../../../theme/appTheme';
import { urls } from '../../../services/api/afari';

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Inicio',
    headerRight: <IconButton icon="reply" onPress={navigation.getParam('logout')} />
    // headerLeft: <Button icon="dehaze" onPress={() => navigation.toggleDrawer()} />
  });

  state = {
    isLoading: false,
    owner: {
      name: '',
      email: '',
      lastPayment: ''
    },
    building: {
      id: 0,
      name: '',
      apartmentId: '',
      apartmentName: ''
    },
    currentTimeUnit: {
      id: 0,
      name: ''
    }
  };

  _getCurrentTimeUnit = async () => {
    let url = urls.getUnidadTiempoActual;
    await fetch(url)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          let timeUnit = {
            id: parsedRes.unidadTiempoActual.unidadTiempoId,
            name: parsedRes.unidadTiempoActual.nombre
          };

          this.setState({ currentTimeUnit: timeUnit });
        }
      });
  };

  _getBasicData = async () => {
    this.setState({ isLoading: true });
    //let userId = await AsyncStorage.getItem(constants.user.userId);
    let owner = {
      name: await AsyncStorage.getItem(constants.user.name),
      email: await AsyncStorage.getItem(constants.user.email),
      lastPayment: await AsyncStorage.getItem(constants.user.lastPayment)
    };
    let building = {
      id: await AsyncStorage.getItem(constants.building.id),
      name: await AsyncStorage.getItem(constants.building.name),
      apartmentId: await AsyncStorage.getItem(constants.building.apartmentId),
      apartmentName: await AsyncStorage.getItem(constants.building.apartmentName)
    };

    this.setState({
      owner: owner,
      building: building
    });

    this.setState({ isLoading: false });
  };

  _downloadReceiptHandler = () => {
    let downloadReceiptUrl = `${urls.getReciboMantenimientoPorId}?departamentoId=${this.state.building.apartmentId}&unidadTiempoId=${this.state.currentTimeUnit.id}`;

    let fileName = `DPTO-${
      this.state.building.apartmentName
    }-${this.state.currentTimeUnit.name.replace(' ', '-')}.pdf`;

    this.props.navigation.navigate('Pdf', {
      downloadUri: downloadReceiptUrl,
      fileName: fileName
    });
  };

  _apartmentsFeesHandler = () => {
    this.props.navigation.navigate('Fees', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name
    });
  };

  _downloadFeesHandler = () => {
    let downloadReceiptUrl = `${urls.getCuotaPorDepartamento}?departamentoId=${this.state.building.apartmentId}&unidadTiempoId=${this.state.currentTimeUnit.id}`;

    let fileName = `REPORTE-${this.state.currentTimeUnit.name.replace(' ', '-')}.pdf`;

    this.props.navigation.navigate('Pdf', {
      downloadUri: downloadReceiptUrl,
      fileName: fileName
    });
  };

  _incomeAndExpensesHandler = () => {
    this.props.navigation.navigate('IncomeAndExpenses', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name
    });
  };

  _vouchersHandler = () => {
    this.props.navigation.navigate('Vouchers', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name
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

  _getAllData = async () => {
    this.setState({ isLoading: true });
    await this._getBasicData();
    await this._getCurrentTimeUnit();
    this.setState({ isLoading: false });
  };

  componentDidMount() {
    this.props.navigation.setParams({ logout: this._signoutPressHandler });
    this._getAllData();
  }

  render() {
    let loadingIndicator = (
      <View style={styles.loadingContainer}>
        <WaveIndicator color={colors.afariGreen} size={100} />
      </View>
    );

    let content = (
      <ScrollView style={styles.container}>
        <View style={styles.dataContainer}>
          <View style={styles.dataRowContainer}>
            <Text style={styles.textKey}>Periodo Actual</Text>
            <Text style={styles.ammountLabel}>{this.state.currentTimeUnit.name}</Text>
          </View>
          <View style={styles.dataRowContainer}>
            <Text style={styles.textKey}>Última cuota pagada</Text>
            <Text style={styles.ammountLabel}>{this.state.owner.lastPayment}</Text>
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <Surface style={styles.surface}>
            <List.Item
              title="Recibo de Mantenimiento"
              onPress={() => this._downloadReceiptHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="library-books"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Cuota por Departamento"
              onPress={() => this._downloadFeesHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="local-atm"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Ingresos y Gastos"
              onPress={() => this._incomeAndExpensesHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="attach-money"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Comprobantes de Pago"
              onPress={() => this._vouchersHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="beenhere"
                />
              )}
            />
          </Surface>
        </View>
      </ScrollView>
    );

    return this.state.isLoading ? loadingIndicator : content;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  dataContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 15,
    justifyContent: 'space-between'
  },
  dataRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginBottom: 10
  },
  surface: {
    elevation: 4,
    borderRadius: 5,
    marginTop: 10
  },
  listItemIcon: {
    margin: 0
  },
  textKey: {
    fontWeight: '500',
    fontSize: 18
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ammountLabel: {
    color: colors.afariGreen,
    fontSize: 18
  }
});

export default HomeScreen;
