import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, Text, Divider } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { colors } from '../../../theme/appTheme';
import { urls } from '../../../services/api/afari';

class MaitenanceScheduleScreen extends Component {
  static navigationOptions = {
    title: 'Cronograma de Mant.'
  };

  state = {
    loading: false,
    building: {
      id: this.props.navigation.getParam('buildingId', 'No-Id'),
      name: this.props.navigation.getParam('buildingName', 'No-Name')
    },
    schedules: []
  };

  _getMaitenanceSchedules = async () => {
    let schedulesUrl = `${urls.getCronogramaMantenimiento}?edificioId=${this.state.building.id}`;

    await fetch(schedulesUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          this.setState({ schedules: parsedRes.lstCronograma });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  _downloadScheduleHandler = (year) => {
    let downloadUrl = `${urls.getCronogramaPdf}?edificioId=${this.state.building.id}&anio=${year}`;
    let fileName = `Cronograma-Mantenimiento-${this.state.building.name.replace(
      ' ',
      '-'
    )}-${year}.pdf`;

    this.props.navigation.navigate('Pdf', {
      downloadUri: downloadUrl,
      fileName: fileName
    });
  };

  //Fetch Data for the first time
  getAllData = async () => {
    this.setState({ loading: true });
    await this._getMaitenanceSchedules();
    this.setState({ loading: false });
  };

  componentDidMount() {
    this.getAllData();
  }

  render() {
    const { schedules, loading } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <FlatList
        data={schedules}
        style={styles.list}
        renderItem={({ item }) => (
          <View>
            <List.Item
              title={`${item.anio}`}
              right={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="arrow-forward"
                />
              )}
              onPress={() => this._downloadScheduleHandler(item.anio)}
            />
            <Divider />
          </View>
        )}
        keyExtractor={(item) => `${item.anio}`}
      />
    );

    return !loading ? (
      <View style={styles.container}>
        {schedules.length > 0 ? list : <Text>No se encontraron resultados</Text>}
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
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  list: {
    marginTop: 5,
    width: '100%'
  },
  listItemIcon: {
    margin: 0
  }
});

export default MaitenanceScheduleScreen;
