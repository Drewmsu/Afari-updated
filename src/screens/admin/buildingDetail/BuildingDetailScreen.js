import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { colors } from '../../../theme/appTheme';
import { urls } from '../../../services/api/afari';
import { numberWithCommas } from '../../../utils/numbersHelper';

class BuildingDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('buildingName', 'No-Name')
    };
  };

  state = {
    loading: false,
    building: {
      id: this.props.navigation.getParam('buildingId', 'No-Id'),
      name: this.props.navigation.getParam('buildingName', 'No-Name')
    },
    buildingData: {},
    mora: '',
    apartmentNumber: '',
    saldoAnterior: '',
    saldoHistorico: '',
    PresupuestoMensual: ''
  };

  _getbuildingData = async () => {
    let url = `${urls.getDetalleEdificio}?edificioId=${this.state.building.id}`;
    await fetch(url)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          let building = parsedRes.detalleEdificio;
          this.setState({
            buildingData: building,
            mora: building.PMora.toFixed(2),
            apartmentNumber: String(building.NroDepartamentos),
            saldoAnterior:
              building.SaldoAnteriorUnidadTiempo != null
                ? numberWithCommas(building.SaldoAnteriorUnidadTiempo.toFixed(2))
                : '',
            saldoHistorico:
              building.SaldoHistorico != null
                ? numberWithCommas(building.SaldoHistorico.toFixed(2))
                : '',
            PresupuestoMensual:
              building.PresupuestoMensual != null
                ? numberWithCommas(building.PresupuestoMensual.toFixed(2))
                : ''
          });
        }
      });
  };

  getTextFactor = (factor) => {
    switch (factor) {
      case 'IGU':
        return 'TODOS IGUALES';
      case 'GAS':
        return 'FACTOR DE GASTO';
      case 'CON':
        return 'CONSUMO DE AGUA';
      default:
        return '';
    }
  };

  _getAllData = async () => {
    this.setState({ loading: true });
    await this._getbuildingData();
    this.setState({ loading: false });
  };

  componentDidMount() {
    this._getAllData();
  }

  render() {
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let buildingData = (
      <ScrollView style={styles.dataContainer}>
        <List.Item title="Acrónimo" description={this.state.buildingData.Acronimo} />
        <List.Item title="Nombre" description={this.state.buildingData.Nombre} />
        <List.Item title="Tipo" description={this.state.buildingData.NombreTipoInmueble} />
        <List.Item title="Dirección" description={this.state.buildingData.Direccion} />
        <List.Item title="Referencia" description={this.state.buildingData.Referencia} />
        <List.Item title="N° Departamentos" description={this.state.apartmentNumber} />
        <List.Item title="Monto Cuota" description={String(this.state.buildingData.MontoCuota)} />
        <List.Item title="Departamento" description={this.state.buildingData.NombreDepartamento} />
        <List.Item title="Provincia" description={this.state.buildingData.NombreProvincia} />
        <List.Item title="Distrito" description={this.state.buildingData.NombreDistrito} />
        <List.Item
          title="Identificador"
          description={String(this.state.buildingData.Identificador)}
        />
        <List.Item
          title="Mora"
          description={
            this.state.mora +
            ' (' +
            (this.state.buildingData.TipoMora === 'BRU' ? 'Bruto' : 'Porcentaje') +
            ')'
          }
        />
        <List.Item
          title="Día de mora (Cierra Cuotas)"
          description={String(this.state.buildingData.DiaMora)}
        />
        <List.Item title="Nro. de Cuenta" description={this.state.buildingData.NroCuenta} />
        <List.Item title="Saldo Anterior" description={this.state.saldoAnterior} />
        <List.Item title="Saldo Historico" description={this.state.saldoHistorico} />
        <List.Item
          title="Desfase Recibos"
          description={
            this.state.buildingData.Desfase != null ? String(this.state.buildingData.Desfase) : null
          }
        />
        <List.Item
          title="Nombre pago via internet recibo"
          description={this.state.buildingData.Representante}
        />
        <List.Item title="Nombre Pago (Recibos)" description={this.state.buildingData.NombrePago} />
        <List.Item title="Presupuesto Mensual" description={this.state.PresupuestoMensual} />
        <List.Item
          title="Factor de Gastos - Area Comun"
          description={this.getTextFactor(this.state.buildingData.FactorAreaComun)}
        />
        <List.Item
          title="Factor de Gastos - Alcantarillado"
          description={this.getTextFactor(this.state.buildingData.FactorAlcantarillado)}
        />
        <List.Item
          title="Factor de Gastos - Cargo Fijo"
          description={this.getTextFactor(this.state.buildingData.FactorCargoFijo)}
        />
        <List.Item
          title="Mensaje Mora (Recibo)"
          description={this.state.buildingData.MensajeMora}
        />
      </ScrollView>
    );

    return (
      <View style={styles.container}>
        {!this.state.loading ? (
          Object.entries(this.state.buildingData).length === 0 &&
          this.state.buildingData.constructor === Object ? (
            <View style={styles.notFoundContainer}>
              <Text>No se encontraron resultados</Text>
            </View>
          ) : (
            buildingData
          )
        ) : (
          <View style={styles.loadingContainer}>{spinner}</View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 2
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dataContainer: {
    flex: 1,
    marginHorizontal: 0
  }
});

export default BuildingDetailScreen;
