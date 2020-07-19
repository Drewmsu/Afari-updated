import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import { List, Button, Text, Divider } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { colors, appTheme } from '../../../theme/appTheme';
import { dropdownStyles } from '../../../theme/shared';
import { urls } from '../../../services/api/afari';

class MaitenanceReceiptsScreen extends Component {
  static navigationOptions = {
    title: 'Recibos de Mantenimiento'
  };

  state = {
    firstLoading: false,
    listLoading: false,
    expanded: false,
    building: {
      id: this.props.navigation.getParam('buildingId', 'No-Id'),
      name: this.props.navigation.getParam('buildingName', 'No-Name'),
      arrear: 0,
      arrearType: 'Bruto',
      arrearDayOfMonth: '10/Mes'
    },
    apartments: [{ id: null, value: 'Todos' }],
    timeUnits: [],
    selectedApartment: { id: null, value: 'Todos' },
    selectedTimeUnit: { id: null, value: '' },
    receipts: []
  };

  _getApartments = async () => {
    let apartmentsUrl = `${urls.getDepartamentos}?edificioId=${this.state.building.id}`;
    await fetch(apartmentsUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          let newApartments = [...this.state.apartments];
          parsedRes.lstDepartamento.map((item) => {
            let apartment = {
              id: item.departamentoId,
              value: item.numero
            };
            newApartments.push(apartment);
          });
          this.setState({
            apartments: newApartments
          });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  _getTimeUnits = async () => {
    let timeUnitsUrl = `${urls.getUnidadTiempo}?FlagEsActivo=true`;
    await fetch(timeUnitsUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          let timeUnits = [];
          parsedRes.lstUnidadTiempo.map((item) => {
            let timeUnit = {
              id: item.unidadTiempoId,
              value: item.nombre
            };
            timeUnits.push(timeUnit);
          });
          this.setState({
            timeUnits: timeUnits,
            selectedTimeUnit: timeUnits[0]
          });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  _getMaitenanceReceipts = async () => {
    //?edificioId=3055&departamentoId=&unidadTiempoId=
    let receiptsUrl = `${urls.getRecibosMantenimiento}?edificioId=${this.state.building.id}&departamentoId=${this.state.selectedApartment.id}&unidadTiempoId=${this.state.selectedTimeUnit.id}`;
    await fetch(receiptsUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          this.setState({ receipts: parsedRes.lstRecibosMantenimiento });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  _downloadReceiptHandler = (apartmentId, apartmentName) => {
    let downloadReceiptUrl = `${urls.getReciboMantenimientoPorId}?departamentoId=${apartmentId}&unidadTiempoId=${this.state.selectedTimeUnit.id}`;

    let fileName = `DPTO-${apartmentName}-${this.state.selectedTimeUnit.value.replace(
      ' ',
      '-'
    )}.pdf`;

    this.props.navigation.navigate('Pdf', {
      downloadUri: downloadReceiptUrl,
      fileName: fileName
    });
  };

  //Fetch Data for the first time
  _getAllData = async () => {
    this.setState({ firstLoading: true });
    await this._getApartments();
    await this._getTimeUnits();
    await this._getMaitenanceReceipts();
    this.setState({ firstLoading: false });
  };

  //Fetch data when filter is applied
  getListHandler = async () => {
    //fetch here after filters
    this.setState({ listLoading: true });
    await this._getMaitenanceReceipts();
    this.setState({ listLoading: false });
  };

  onApartmentDropdownChange = (value) => {
    let apartments = [...this.state.apartments];
    let selectedApartment = apartments.find((x) => x.value === value);
    this.setState({ selectedApartment: selectedApartment });
  };

  onTimeUnitDropdownChange = (value) => {
    let timeUnits = [...this.state.timeUnits];
    let selectedTimeUnit = timeUnits.find((x) => x.value === value);
    this.setState({ selectedTimeUnit: selectedTimeUnit });
  };

  _handleExpandedPress = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  //Actions executed when filter button is pressed
  _onFilterHandler = () => {
    //fetch list handler
    this.getListHandler();
    this._handleExpandedPress();
  };

  componentDidMount() {
    this._getAllData();
  }

  render() {
    const { apartments, timeUnits } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <FlatList
        data={this.state.receipts}
        style={styles.list}
        renderItem={({ item }) => (
          <View>
            <List.Item
              title={`${item.departamentoDescripcion.split(' ')[1]} - ${
                item.unidadTiempoDescripcion
              }`}
              right={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="arrow-right"
                />
              )}
              onPress={() =>
                this._downloadReceiptHandler(
                  item.departamentoId,
                  item.departamentoDescripcion.split(' ')[1]
                )
              }
            />
            <Divider />
          </View>
        )}
        keyExtractor={(item) => `${item.departamentoId}`}
      />
    );

    return !this.state.firstLoading ? (
      <View style={styles.container}>
        <List.Accordion
          title="Filtros"
          expanded={this.state.expanded}
          onPress={() => this._handleExpandedPress()}
          left={(props) => <List.Icon {...props} icon="filter-variant" />}>
          <Dropdown
            label="Departamento"
            data={apartments}
            textColor={colors.white}
            baseColor={colors.white}
            pickerStyle={dropdownStyles.dropdownPickerStyle}
            dropdownOffset={{ top: 16, left: 0 }}
            itemColor={appTheme.colors.placeholder}
            itemCount={8}
            value={this.state.selectedApartment.value}
            onChangeText={(value) => this.onApartmentDropdownChange(value)}
          />
          <Dropdown
            label="Periodo"
            data={timeUnits}
            textColor={colors.white}
            baseColor={colors.white}
            pickerStyle={dropdownStyles.dropdownPickerStyle}
            dropdownOffset={{ top: 16, left: 0 }}
            itemColor={appTheme.colors.placeholder}
            itemCount={8}
            value={this.state.selectedTimeUnit.value}
            onChangeText={(value) => this.onTimeUnitDropdownChange(value)}
          />
          <View style={styles.filterButtonContainer}>
            <Button
              mode="contained"
              style={styles.filterButton}
              onPress={() => this._onFilterHandler()}>
              Filtrar
            </Button>
          </View>
        </List.Accordion>
        <View style={styles.listContainer}>
          {!this.state.listLoading ? (
            this.state.receipts.length > 0 ? (
              list
            ) : (
              <Text>No se encontraron resultados</Text>
            )
          ) : (
            spinner
          )}
        </View>
      </View>
    ) : (
      <View style={styles.loadingContainer}>{spinner}</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 5
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterButtonContainer: {
    justifyContent: 'center',
    marginTop: 5
  },
  filterButton: {
    borderColor: 'white',
    borderRadius: 5,
    marginLeft: Platform.OS === 'ios' ? '-19%' : '-23%',
    backgroundColor: colors.afariLightBlue
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: {
    marginTop: 5,
    width: '100%'
  },
  listItemIcon: {
    margin: 0
  }
});

export default MaitenanceReceiptsScreen;
