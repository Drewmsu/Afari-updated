import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import { List, Button, Text } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { Dropdown } from 'react-native-material-dropdown-v2';
import CloseFeesCardItem from '../../../components/shared/CloseFeesCardItem';
import { colors, appTheme } from '../../../theme/appTheme';
import { dropdownStyles } from '../../../theme/shared';
import { urls } from '../../../services/api/afari';
import { numberWithCommas } from '../../../utils/numbersHelper';

class CloseFeesScreen extends Component {
  static navigationOptions = {
    title: 'Cerrar Cuotas'
  };

  state = {
    firstLoading: false,
    listLoading: false,
    expanded: false,
    building: {
      id: this.props.navigation.getParam('buildingId', 'No-Id'),
      name: this.props.navigation.getParam('buildingName', 'No-Name'),
      arrear: 0,
      arrearType: '',
      arrearDayOfMonth: ''
    },
    apartments: [{ id: '', value: 'Todos' }],
    states: [
      { id: '', value: 'Todos' },
      { id: 0, value: 'Sin Pagar' },
      { id: 1, value: 'Pagado' }
    ],
    selectedApartment: { id: '', value: 'Todos' },
    selectedApartmentState: { id: 0, value: 'Sin Pagar' },
    currentTimeUnitId: null,
    fees: []
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

  _getCuoutes = async () => {
    //get current time unit
    await fetch(urls.getUnidadTiempoActual)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          let id = parsedRes.unidadTiempoActual.unidadTiempoId;
          this.setState({
            currentTimeUnitId: id
          });
        }
      });
    //fetch fees
    //?edificioId=3033&unidadTiempoIdInicio=1076&unidadTiempoIdFin=1076&estado=&departamentoId= ${this.state.currentTimeUnitId - 3}
    let closeFeesUrl = `${urls.getCerrarCuotas}?edificioId=${this.state.building.id}&unidadTiempoIdInicio=&unidadTiempoIdFin=${this.state.currentTimeUnitId}&estado=${this.state.selectedApartmentState.id}&departamentoId=${this.state.selectedApartment.id}`;

    await fetch(closeFeesUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          this.setState({
            fees: parsedRes.lstCuota
          });
          let building = { ...this.state.building };
          building.arrear = parsedRes.mora;
          building.arrearType = parsedRes.tipoMora === 'BRU' ? 'BRUTO' : 'PORCENTAJE';
          building.arrearDayOfMonth = parsedRes.diaMesConsiderar;
          this.setState({ building: building });
        }
      });
  };

  //Fetch Data for the first time
  _getAllData = async () => {
    this.setState({ firstLoading: true });

    await this._getApartments();
    await this._getCuoutes();

    this.setState({ firstLoading: false });
  };

  //Fetch data when filter is applied
  _getListHandler = async () => {
    //fetch here after filters
    this.setState({ listLoading: true });
    await this._getCuoutes();
    this.setState({ listLoading: false });
  };

  onApartmentDropdownChange = (value) => {
    //let apartments = [...this.state.apartments];
    let selectedApartment = this.state.apartments.find((x) => x.value === value);
    this.setState({ selectedApartment: selectedApartment });
  };

  onStateDropdownChange = (value) => {
    let states = [...this.state.states];
    let state = states.find((x) => x.value === value);
    this.setState({ selectedApartmentState: state });
  };

  _handleExpandedPress = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  //Actions executed when filter button is pressed
  _onFilterHandler = () => {
    //fetch list handler
    this._getListHandler();
    this._handleExpandedPress();
  };

  componentDidMount() {
    this._getAllData();
  }

  render() {
    const { apartments, states } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <FlatList
        data={this.state.fees}
        style={styles.list}
        maxToRenderPerBatch={20} //because it doesnt have tap action
        initialNumToRender={20}
        renderItem={({ item }) => (
          <CloseFeesCardItem
            title={item.departamentoDescripcion}
            isPayed={item.pagado}
            timeUnit={item.unidadTiempoDescripcion}
            isPrePayment={item.esPagoAdelantado}
            total={numberWithCommas(item.total)}
          />
        )}
        keyExtractor={(item) => `${item.cuotaId}`}
      />
    );

    return !this.state.firstLoading ? (
      <View style={styles.container}>
        <View style={styles.dataContainer}>
          <View style={styles.dataRowContainer}>
            <Text style={styles.textKey}>Mora</Text>
            <Text>{this.state.building.arrear}</Text>
          </View>
          <View style={styles.dataRowContainer}>
            <Text style={styles.textKey}>Tipo Mora</Text>
            <Text>{this.state.building.arrearType}</Text>
          </View>
          <View style={styles.dataRowContainer}>
            <Text style={styles.textKey}>Día del mes a considerar</Text>
            <Text>{this.state.building.arrearDayOfMonth}</Text>
          </View>
        </View>
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
            containerStyle={{ backgroundColor: 'transparent' }}
            dropdownOffset={{ top: 16, left: 0 }}
            itemColor={appTheme.colors.placeholder}
            itemCount={8}
            value={this.state.selectedApartment.value}
            onChangeText={(value) => this.onApartmentDropdownChange(value)}
          />
          <Dropdown
            label="Estado"
            data={states}
            textColor={colors.white}
            baseColor={colors.white}
            pickerStyle={dropdownStyles.dropdownPickerStyle}
            dropdownOffset={{ top: 16, left: 0 }}
            itemColor={appTheme.colors.placeholder}
            itemCount={8}
            value={this.state.selectedApartmentState.value}
            onChangeText={(value) => this.onStateDropdownChange(value)}
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
            this.state.fees.length > 0 ? (
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
  dataContainer: {
    marginHorizontal: 10,
    marginTop: 15,
    justifyContent: 'space-between'
  },
  dataRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  textKey: {
    fontWeight: '500'
  }
});

export default CloseFeesScreen;
