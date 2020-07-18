import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { List, Surface, IconButton } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import dateFnsFormat from 'date-fns/format';
import { colors } from '../../../theme/appTheme';
import { urls } from '../../../services/api/afari';
import constants from '../../../utils/constants';

class MoreOptionsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Opciones',
      headerRight: <IconButton icon="reply" onPress={navigation.getParam('logout')} />
    };
  };

  state = {
    isLoading: false,
    owner: {
      name: '',
      email: ''
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
      email: await AsyncStorage.getItem(constants.user.email)
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

    await this._getCurrentTimeUnit();
    this.setState({ isLoading: false });
  };

  _maitenanceReceiptsHandler = () => {
    this.props.navigation.navigate('MaitenanceReceipts', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name,
      apartmentId: this.state.building.apartmentId,
      apartmentName: this.state.building.apartmentName
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

  _deliquencyChartHandler = async () => {
    const date = dateFnsFormat(new Date(), 'DD/MM/YYYY');
    let downloadUrl = `${urls.getCuadroMorosidad}?edificioId=${this.state.building.id}`;
    let fileName = `CuadroMoroso_${this.state.building.name.replace(' ', '-')}_${date
      .replace('/', '_')
      .replace('/', '_')}.pdf`;

    this.props.navigation.navigate('Pdf', {
      downloadUri: downloadUrl,
      fileName: fileName
    });
  };

  _newsHandler = () => {
    this.props.navigation.navigate('News', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name
    });
  };

  _laboralObligationsHandler = () => {
    this.props.navigation.navigate('LaboralObligations', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name
    });
  };

  _equipmentCertificateHandler = () => {
    this.props.navigation.navigate('EquipmentCertificate', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name
    });
  };

  _maitenanceScheduleHandler = () => {
    this.props.navigation.navigate('MaitenanceSchedule', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name
    });
  };

  _accountStatusHandler = () => {
    this.props.navigation.navigate('AccountStatus', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name
    });
  };

  _employeesHandler = () => {
    this.props.navigation.navigate('Employees', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name
    });
  };

  _houseRulesHandler = async () => {
    let url = `${urls.getNormasConvivencia}?edificioId=${this.state.building.id}`;
    await fetch(url)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes == null || parsedRes === '') {
          alert('Archivo no disponible por el momento');
        } else {
          let fileName = `${this.state.building.name}-Normas_Convivencia.pdf`;
          let downloadReceiptUrl = parsedRes;
          this.props.navigation.navigate('Pdf', {
            downloadUri: downloadReceiptUrl,
            fileName: fileName,
            type: constants.viewType.web
          });
        }
      });
  };

  _admMenuHandler = () => {
    this.props.navigation.navigate('AdmMenu', {
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

  componentDidMount() {
    this.props.navigation.setParams({ logout: this._signoutPressHandler });
    this._getBasicData();
  }

  render() {
    let content = (
      <ScrollView style={styles.container}>
        <View style={styles.optionsContainer}>
          <Surface style={styles.surface}>
            <List.Item
              title="Recibos de Mantenimiento"
              onPress={() => this._maitenanceReceiptsHandler()}
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
          <Surface style={styles.surface}>
            <List.Item
              title="Cuadro de Morosidad"
              onPress={() => this._deliquencyChartHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="view-list"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Noticias"
              onPress={() => this._newsHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="message"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Obligaciones Laborales"
              onPress={() => this._laboralObligationsHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="card-travel"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Normas de Convivencia"
              onPress={() => this._houseRulesHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="assignment"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Certificado de Equipos"
              onPress={() => this._equipmentCertificateHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="markunread-mailbox"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Cronograma de Mantenimiento"
              onPress={() => this._maitenanceScheduleHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="schedule"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Estados de Cuenta"
              onPress={() => this._accountStatusHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="account-balance"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Trabajadores"
              onPress={() => this._employeesHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="supervisor-account"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Normas de Convivencia"
              onPress={() => this._houseRulesHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="insert-drive-file"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Adm. Menu"
              onPress={() => this._admMenuHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="border-all"
                />
              )}
            />
          </Surface>
        </View>
      </ScrollView>
    );

    return !this.state.isLoading ? (
      content
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
  optionsContainer: {
    flex: 3,
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
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default MoreOptionsScreen;
