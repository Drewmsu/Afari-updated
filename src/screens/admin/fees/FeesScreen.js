import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import { List, Divider, Button, Text } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { Dropdown } from 'react-native-material-dropdown';
import { colors, appTheme } from '../../../theme/appTheme';
import { dropdownStyles } from '../../../theme/shared';
import { urls } from '../../../services/api/afari';

class FeesScreen extends Component {
  static navigationOptions = {
    title: 'Cuotas por Departamento'
  };

  state = {
    firstLoading: false,
    listLoading: false,
    expanded: false,
    building: {
      id: this.props.navigation.getParam('buildingId', 'No-Id'),
      name: this.props.navigation.getParam('buildingName', 'No-Name')
    },
    years: [],
    selectedYear: { id: null, value: '' },
    timeUnits: [],
    renderedTimeUnits: [],
    apartmentId: null
  };

  _setYears = async () => {
    const date = new Date();
    const currentYear = date.getFullYear();
    let generatedYears = [];
    for (let i = currentYear; i >= 2014; i--) {
      let year = { id: i, value: i };
      generatedYears.push(year);
    }
    this.setState({ years: generatedYears });
    this.setState({ selectedYear: generatedYears[0] });
  };

  _getApartments = async () => {
    let apartmentsUrl = `${urls.getDepartamentos}?edificioId=${this.state.building.id}`;
    await fetch(apartmentsUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          this.setState({ apartmentId: parsedRes.lstDepartamento[0].departamentoId });
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
          this.setState({
            timeUnits: parsedRes.lstUnidadTiempo,
            renderedTimeUnits: parsedRes.lstUnidadTiempo.filter((x) =>
              x.nombre.includes(this.state.selectedYear.value)
            )
          });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  _filterTimeUnits = () => {
    let timeUnitsToRender = [
      ...this.state.timeUnits.filter((x) => x.nombre.includes(this.state.selectedYear.value))
    ];
    this.setState({ renderedTimeUnits: timeUnitsToRender });
  };

  //Fetch Data for the first time
  getAllData = async () => {
    this.setState({ firstLoading: true });
    await this._setYears();
    await this._getApartments();
    await this._getTimeUnits();
    this.setState({ firstLoading: false });
  };

  //Fetch data when filter is applied
  getListHandler = async () => {
    this.setState({ listLoading: true });
    this._filterTimeUnits();
    this.setState({ listLoading: false });
  };

  onYearDropdownChange = (value) => {
    let years = [...this.state.years];
    let selectedYear = years.find((x) => x.value === value);
    this.setState({ selectedYear: selectedYear });
  };

  _handleExpandedPress = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  //Actions executed when filter button is pressed
  _onFilterHandler = () => {
    this.getListHandler();
    this._handleExpandedPress();
  };

  //departamentoId=3677&unidadTiempoId=1095
  _downloadFeeHandler = (timeUnit) => {
    let downloadReceiptUrl = `${urls.getCuotaPorDepartamento}?departamentoId=${this.state.apartmentId}&unidadTiempoId=${timeUnit.unidadTiempoId}`;
    let fileName = `REPORTE-${timeUnit.nombre.replace(' ', '-')}.pdf`;

    this.props.navigation.navigate('Pdf', {
      downloadUri: downloadReceiptUrl,
      fileName: fileName
    });
  };

  componentDidMount() {
    this.getAllData();
  }

  render() {
    const { years } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <FlatList
        data={this.state.renderedTimeUnits}
        style={styles.list}
        renderItem={({ item }) => (
          <View>
            <List.Item
              title={`${item.nombre}`}
              right={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="arrow-forward"
                />
              )}
              onPress={() => this._downloadFeeHandler(item)}
            />
            <Divider />
          </View>
        )}
        keyExtractor={(item) => `${item.unidadTiempoId}`}
      />
    );

    return !this.state.firstLoading ? (
      <View style={styles.container}>
        <List.Accordion
          title="Filtros"
          expanded={this.state.expanded}
          onPress={() => this._handleExpandedPress()}
          left={(props) => <List.Icon {...props} icon="filter-list" />}>
          <Dropdown
            label="Año"
            data={years}
            textColor={colors.white}
            baseColor={colors.white}
            pickerStyle={dropdownStyles.dropdownPickerStyle}
            dropdownOffset={{ top: 16, left: 0 }}
            itemColor={appTheme.colors.placeholder}
            itemCount={8}
            value={this.state.selectedYear.value}
            onChangeText={(value) => this.onYearDropdownChange(value)}
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
            this.state.renderedTimeUnits.length > 0 ? (
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

export default FeesScreen;
