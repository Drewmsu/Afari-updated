import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { List, Button, Card, Text, Paragraph } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { colors, appTheme } from '../../../theme/appTheme';
import { dropdownStyles } from '../../../theme/shared';
import { urls } from '../../../services/api/afari';
import constants from '../../../utils/constants';

class EquipmentCertificateScreen extends Component {
  static navigationOptions = {
    title: 'Certificado de Equipos'
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
    certificates: []
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

  _getEquipemtCertificates = async () => {
    //?edificioId=3032&anio=2019
    let certificatesUrl = `${urls.getCertificadoEquipos}?edificioId=${this.state.building.id}&anio=${this.state.selectedYear.id}`;

    await fetch(certificatesUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          this.setState({ certificates: parsedRes.lstCertficadosEquipos });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  //Fetch Data for the first time
  getAllData = async () => {
    this.setState({ firstLoading: true });
    await this._setYears();
    await this._getEquipemtCertificates();
    this.setState({ firstLoading: false });
  };

  getListHandler = async () => {
    //fetch here after filters
    this.setState({ listLoading: true });
    await this._getEquipemtCertificates();
    this.setState({ listLoading: false });
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
    //fetch list handler
    this.getListHandler();
    this._handleExpandedPress();
  };

  componentDidMount() {
    this.getAllData();
  }

  render() {
    const { years, certificates, firstLoading, listLoading, expanded } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <FlatList
        data={certificates}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => this._downloadReceiptHandler(item.documento)}>
            <Card style={styles.card}>
              <Card.Title
                title={item.detalleUnidadTiempo}
                titleStyle={{ color: colors.afariGreen }}
              />
              <Card.Content>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Paragraph>
                    {item.tipo}
                    {'\n'}
                    {'\n'}
                    {item.Nombre}
                  </Paragraph>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => `${item.id}`}
      />
    );

    return !firstLoading ? (
      <View style={styles.container}>
        <List.Accordion
          title="Filtros"
          expanded={expanded}
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
        <View style={styles.listContainer}>
          {!listLoading ? (
            certificates.length > 0 ? (
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
  card: {
    margin: 5,
    elevation: 5,
    shadowOpacity: 0.5
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

export default EquipmentCertificateScreen;
