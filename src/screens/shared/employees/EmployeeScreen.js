import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import EmployeeCardItem from '../../../components/shared/EmployeeCardItem';
import { colors } from '../../../theme/appTheme';
import { urls } from '../../../services/api/afari';

class EmployeeScreen extends Component {
  static navigationOptions = {
    title: 'Trabajadores'
  };

  state = {
    loading: false,
    building: {
      id: this.props.navigation.getParam('buildingId', 'No-Id'),
      name: this.props.navigation.getParam('buildingName', 'No-Name')
    },
    employees: []
  };

  _getEmployees = async () => {
    let employeesUrl = `${urls.getTrabajadores}?edificioId=${this.state.building.id}`;
    await fetch(employeesUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          let employees = parsedRes.lstTrabajador;
          this.setState({ employees: employees });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  //Fetch Data for the first time
  getAllData = async () => {
    this.setState({ loading: true });
    await this._getEmployees();
    this.setState({ loading: false });
  };

  componentDidMount() {
    this.getAllData();
  }

  render() {
    const { employees, loading } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <FlatList
        data={employees}
        style={styles.list}
        maxToRenderPerBatch={20} //because it doesnt have tap action
        initialNumToRender={20}
        renderItem={({ item }) => (
          <EmployeeCardItem
            charge={item.cargo}
            name={item.nombre}
            dni={item.dni}
            //image={item.foto}
          />
        )}
        keyExtractor={(item) => `${item.trabajadorId}`}
      />
    );

    return !loading ? (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          {employees.length > 0 ? list : <Text>No se encontraron resultados</Text>}
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
  }
});

export default EmployeeScreen;
