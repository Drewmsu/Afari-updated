import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Dimensions, ScrollView, Platform } from 'react-native';
import { List, Button, Text, Divider } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { colors, appTheme } from '../../../theme/appTheme';
import { dropdownStyles } from '../../../theme/shared';
import { urls } from '../../../services/api/afari';
import constants from '../../../utils/constants';

const { width } = Dimensions.get('window');

class LaboralObligationsScreen extends Component {
  static navigationOptions = {
    title: 'Obligaciones Laborales'
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
    afpList: [],
    essaludList: [],
    planillaList: [],
    afpExpanded: false,
    essaludExpanded: false,
    planillaExpanded: false,
    obligationsCount: 0
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

  _getLaboralObligations = async () => {
    //?edificioId=3032&anio=2019
    let obligationsUrl = `${urls.getObligacionesLaborales}?edificioId=${this.state.building.id}&anio=${this.state.selectedYear.id}`;
    await fetch(obligationsUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          this.setState({
            afpList: parsedRes.lstObligacionesLaborales
              .filter((x) => x.tipo === constants.laboralObligationType.afp)
              .sort((a, b) => a.unidadTiempoId - b.unidadTiempoId),
            essaludList: parsedRes.lstObligacionesLaborales
              .filter((x) => x.tipo === constants.laboralObligationType.essalud)
              .sort((a, b) => a.unidadTiempoId - b.unidadTiempoId),
            planillaList: parsedRes.lstObligacionesLaborales
              .filter((x) => x.tipo === constants.laboralObligationType.planilla)
              .sort((a, b) => a.unidadTiempoId - b.unidadTiempoId),
            obligationsCount: parsedRes.lstObligacionesLaborales.length
          });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  _downloadReceiptHandler = (url) => {
    let downloadReceiptUrl = url;
    let split = url.split('/');
    let fileName = split[split.length - 1];

    this.props.navigation.navigate('Pdf', {
      downloadUri: downloadReceiptUrl,
      fileName: fileName,
      type: constants.viewType.web
    });
  };

  //Fetch Data for the first time
  _getAllData = async () => {
    this.setState({ firstLoading: true });
    await this._setYears();
    await this._getLaboralObligations();
    this.setState({ firstLoading: false });
  };

  //Fetch data when filter is applied
  getListHandler = async () => {
    this.setState({ listLoading: true });
    await this._getLaboralObligations();
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

  _handleAfpExpanded = () => {
    this.setState({ afpExpanded: !this.state.afpExpanded });
  };

  _handleEssaludExpanded = () => {
    this.setState({ essaludExpanded: !this.state.essaludExpanded });
  };

  _handlePlanillaExpanded = () => {
    this.setState({ planillaExpanded: !this.state.planillaExpanded });
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
    const { years } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <ScrollView style={styles.listContainer}>
        <List.Accordion
          title="AFP"
          expanded={this.state.afpExpanded}
          onPress={() => this._handleAfpExpanded()}>
          <FlatList
            data={this.state.afpList}
            style={styles.list}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={item.detalleUnidadTiempo}
                  description={`${item.Nombre}`}
                  right={(props) => (
                    <List.Icon
                      {...props}
                      color={colors.afariGreen}
                      style={styles.listItemIcon}
                      icon="arrow-right"
                    />
                  )}
                  onPress={() => this._downloadReceiptHandler(item.documento)}
                />
                <Divider />
              </View>
            )}
            keyExtractor={(item) => `${item.id}`}
          />
        </List.Accordion>
        <List.Accordion
          title="Planilla trabajadores"
          expanded={this.state.planillaExpanded}
          onPress={() => this._handlePlanillaExpanded()}>
          <FlatList
            data={this.state.planillaList}
            style={styles.list}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={item.detalleUnidadTiempo}
                  description={`${item.Nombre}`}
                  right={(props) => (
                    <List.Icon
                      {...props}
                      color={colors.afariGreen}
                      style={styles.listItemIcon}
                      icon="arrow-right"
                    />
                  )}
                  onPress={() => this._downloadReceiptHandler(item.documento)}
                />
                <Divider />
              </View>
            )}
            keyExtractor={(item) => `${item.id}`}
          />
        </List.Accordion>
        <List.Accordion
          title="Essalud y Onp"
          expanded={this.state.essaludExpanded}
          onPress={() => this._handleEssaludExpanded()}>
          <FlatList
            data={this.state.essaludList}
            style={styles.list}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={item.detalleUnidadTiempo}
                  description={`${item.Nombre}`}
                  right={(props) => (
                    <List.Icon
                      {...props}
                      color={colors.afariGreen}
                      style={styles.listItemIcon}
                      icon="arrow-right"
                    />
                  )}
                  onPress={() => this._downloadReceiptHandler(item.documento)}
                />
                <Divider />
              </View>
            )}
            keyExtractor={(item) => `${item.id}`}
          />
        </List.Accordion>
      </ScrollView>
    );

    return !this.state.firstLoading ? (
      <View style={styles.container}>
        <List.Accordion
          title="Filtros"
          expanded={this.state.expanded}
          onPress={() => this._handleExpandedPress()}
          left={(props) => <List.Icon {...props} icon="filter-variant" />}>
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
        {!this.state.listLoading ? (
          this.state.obligationsCount > 0 ? (
            list
          ) : (
            <View style={styles.messageContainer}>
              <Text>No se encontraron resultados</Text>
            </View>
          )
        ) : (
          spinner
        )}
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
  listContainer: {
    flex: 1
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
  list: {
    marginTop: 5,
    width: width
  },
  listItemIcon: {
    margin: 0
  }
});

export default LaboralObligationsScreen;
