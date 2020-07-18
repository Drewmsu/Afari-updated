import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import { List, Button, Text, Divider } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { Dropdown } from 'react-native-material-dropdown';
import { colors, appTheme } from '../../../theme/appTheme';
import { dropdownStyles } from '../../../theme/shared';
import { urls } from '../../../services/api/afari';
import constants from '../../../utils/constants';

class VouchersScreen extends Component {
  static navigationOptions = {
    title: 'Comprobantes de Pago'
  };

  state = {
    firstLoading: false,
    listLoading: false,
    expanded: false,
    building: {
      id: this.props.navigation.getParam('buildingId', 'No-Id'),
      name: this.props.navigation.getParam('buildingName', 'No-Name')
    },
    timeUnits: [],
    selectedTimeUnit: { id: null, value: '' },
    currentTimeUnitId: null,
    vouchers: []
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

  _getVouchers = async () => {
    let url = `${urls.getComprobantesPago}?edificioId=${this.state.building.id}&unidadTiempoId=${this.state.selectedTimeUnit.id}`;

    await fetch(url)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          this.setState({ vouchers: parsedRes.LstArchivoGasto });
        }
      });
  };

  _downloadReceiptHandler = (voucher) => {
    let fileName = voucher.nombre.replace(' ', '_');
    this.props.navigation.navigate('Pdf', {
      downloadUri: voucher.url,
      fileName: fileName,
      type: constants.viewType.web
    });
  };

  //Fetch Data for the first time
  _getAllData = async () => {
    this.setState({ firstLoading: true });
    await this._getTimeUnits();
    await this._getVouchers();
    this.setState({ firstLoading: false });
  };

  //Fetch data when filter is applied
  _getListHandler = async () => {
    //fetch here after filters
    this.setState({ listLoading: true });
    await this._getVouchers();
    this.setState({ listLoading: false });
  };

  onTimeUnitDropdownChange = (value) => {
    let selectedTimeUnit = this.state.timeUnits.find((x) => x.value === value);
    this.setState({ selectedTimeUnit: selectedTimeUnit });
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
    const { timeUnits } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <FlatList
        data={this.state.vouchers}
        style={styles.list}
        renderItem={({ item }) => (
          <View>
            <List.Item
              title={item.nombre}
              description={item.nombre}
              right={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="arrow-forward"
                />
              )}
              onPress={() => this._downloadReceiptHandler(item)}
            />
            <Divider />
          </View>
        )}
        keyExtractor={(item) => `${item.id}`}
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
            label="Unidad de Tiempo"
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
            this.state.vouchers.length > 0 ? (
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
  }
});

export default VouchersScreen;
