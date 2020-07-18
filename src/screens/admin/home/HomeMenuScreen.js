import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, List, Surface, IconButton } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import dateFnsFormat from 'date-fns/format';
import { colors } from '../../../theme/appTheme';
import { urls } from '../../../services/api/afari';
import constants from '../../../utils/constants';
import { numberWithCommas } from '../../../utils/numbersHelper';

class HomeMenuScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('buildingName', 'No-Name'),
      headerRight: <IconButton icon="reply" onPress={navigation.getParam('logout')} />
    };
  };

  state = {
    isLoading: false,
    building: {
      id: this.props.navigation.getParam('buildingId', 'No-Id'),
      name: this.props.navigation.getParam('buildingName', 'No-Name'),
      income: 0,
      expenses: 0,
      balance: 0,
      pastBalance: 0,
      totalBalance: 0
    }
  };

  _getBuildingData = async () => {
    this.setState({ isLoading: true });
    let url = `${urls.getEstadoEdificio}?edificioId=${this.state.building.id}&unidadTiempoId=`;
    await fetch(url)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          let newBuilding = { ...this.state.building };
          newBuilding.income = numberWithCommas(parsedRes.ingresos.toFixed(2));
          newBuilding.expenses = numberWithCommas(parsedRes.gastos.toFixed(2));
          newBuilding.balance = numberWithCommas(parsedRes.saldo.toFixed(2));
          newBuilding.pastBalance = numberWithCommas(parsedRes.saldoAnterior.toFixed(2));
          newBuilding.totalBalance = numberWithCommas(parsedRes.saldoAcumulado.toFixed(2));

          this.setState({ building: newBuilding });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
    this.setState({ isLoading: false });
  };

  _buildingDetailHandler = () => {
    this.props.navigation.navigate('BuildingDetail', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name
    });
  };

  _goToCloseFees = () => {
    this.props.navigation.navigate('CloseFees', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name
    });
  };

  _goToMaitenanceReceipts = () => {
    this.props.navigation.navigate('MaitenanceReceipts', {
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

  _apartmentsFeesHandler = () => {
    this.props.navigation.navigate('Fees', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name
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

  _ownerHandler = () => {
    this.props.navigation.navigate('Owners', {
      buildingId: this.state.building.id,
      buildingName: this.state.building.name
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

  _goToEmailScreen = () => {
    this.props.navigation.navigate('Email', {
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
    this._getBuildingData();
  }

  render() {
    let content = (
      <ScrollView style={styles.container}>
        <View style={styles.dataContainer}>
          <View style={styles.dataRowContainer}>
            <Text style={styles.textKey}>Ingresos</Text>
            <Text style={styles.ammountLabel}>{this.state.building.income}</Text>
          </View>
          <View style={styles.dataRowContainer}>
            <Text style={styles.textKey}>Gastos</Text>
            <Text style={styles.ammountLabel}>{this.state.building.expenses}</Text>
          </View>
          <View style={styles.dataRowContainer}>
            <Text style={styles.textKey}>Saldo</Text>
            <Text style={styles.ammountLabel}>{this.state.building.balance}</Text>
          </View>
          <View style={styles.dataRowContainer}>
            <Text style={styles.textKey}>Saldo Anterior</Text>
            <Text style={styles.ammountLabel}>{this.state.building.pastBalance}</Text>
          </View>
          <View style={styles.dataRowContainer}>
            <Text style={styles.textKey}>Saldo Acumulado</Text>
            <Text style={styles.ammountLabel}>{this.state.building.totalBalance}</Text>
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <Surface style={styles.surface}>
            <List.Item
              title="Información del Edificio"
              onPress={() => this._buildingDetailHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="info"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Cerrar Cuotas"
              onPress={() => this._goToCloseFees()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="timer"
                />
              )}
            />
          </Surface>
          <Surface style={styles.surface}>
            <List.Item
              title="Recibos de Mantenimiento"
              onPress={() => this._goToMaitenanceReceipts()}
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
              title="Enviar Email"
              onPress={() => this._goToEmailScreen()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="email"
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
              title="Cuotas por Departamento"
              onPress={() => this._apartmentsFeesHandler()}
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
              title="Relación de Propietarios"
              onPress={() => this._ownerHandler()}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="people"
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
  textKey: {
    fontWeight: '500'
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ammountLabel: {
    color: colors.afariGreen
  }
});

export default HomeMenuScreen;
