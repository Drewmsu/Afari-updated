import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, Text, Divider } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { colors } from '../../../theme/appTheme';
import { urls } from '../../../services/api/afari';

class MaitenanceReceiptsScreen extends Component {
  state = {
    isLoading: false,
    building: {
      id: this.props.navigation.getParam('buildingId', 'No-Id'),
      name: this.props.navigation.getParam('buildingName', 'No-Name'),
      apartmentId: this.props.navigation.getParam('apartmentId', 'No-ApartmentId'),
      apartmentName: this.props.navigation.getParam('apartmentName', 'No-ApartmentName')
    },
    timeUnits: []
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
            timeUnits: parsedRes.lstUnidadTiempo
          });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  _downloadReceiptHandler = (timeUnitId, timeUnitValue) => {
    let downloadReceiptUrl = `${urls.getReciboMantenimientoPorId}?departamentoId=${this.state.building.apartmentId}&unidadTiempoId=${timeUnitId}`;

    let fileName = `DPTO-${this.state.building.apartmentName}-${timeUnitValue}.pdf`;

    this.props.navigation.navigate('Pdf', {
      downloadUri: downloadReceiptUrl,
      fileName: fileName
    });
  };

  //Fetch Data for the first time
  _getAllData = async () => {
    this.setState({ isLoading: true });
    await this._getTimeUnits();
    this.setState({ isLoading: false });
  };

  componentDidMount() {
    this._getAllData();
  }

  render() {
    const { timeUnits } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <FlatList
        data={timeUnits}
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
              onPress={() =>
                this._downloadReceiptHandler(item.unidadTiempoId, item.nombre.replace(' ', '-'))
              }
            />
            <Divider />
          </View>
        )}
        keyExtractor={(item) => `${item.unidadTiempoId}`}
      />
    );

    return !this.state.isLoading ? (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          {this.state.timeUnits.length > 0 ? list : <Text>No se encontraron resultados</Text>}
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
