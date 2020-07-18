import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, Divider, Text } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { colors } from '../../../theme/appTheme';
import { urls } from '../../../services/api/afari';
import constants from '../../../utils/constants';

class AdmMenuScreen extends Component {
  static navigationOptions = {
    title: 'Adm. Menu'
  };

  state = {
    loading: false,
    building: {
      id: this.props.navigation.getParam('buildingId', 'No-Id'),
      name: this.props.navigation.getParam('buildingName', 'No-Name')
    },
    elements: []
  };

  _getElements = async () => {
    let elementsUrl = `${urls.getAdmMenu}?edificioId=${this.state.building.id}`;
    await fetch(elementsUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          this.setState({
            elements: parsedRes.lstAdmMenuBE
          });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  _getAllData = async () => {
    this.setState({ loading: true });
    await this._getElements();
    this.setState({ loading: false });
  };

  _onListItemPressHandler = (url) => {
    let aux = url.split('/');
    let name = aux[aux.length - 1];
    let fileName = name;

    this.props.navigation.navigate('Pdf', {
      downloadUri: url,
      fileName: fileName,
      type: constants.viewType.web
    });
  };

  componentDidMount() {
    this._getAllData();
  }

  render() {
    const { elements } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <FlatList
        data={elements}
        style={styles.list}
        renderItem={({ item }) => (
          <View>
            <List.Item
              description={`${item.nombre}`}
              right={(props) => (
                <List.Icon
                  {...props}
                  color={colors.afariGreen}
                  style={styles.listItemIcon}
                  icon="arrow-forward"
                />
              )}
              onPress={() => this._onListItemPressHandler(item.documento)}
            />
            <Divider />
          </View>
        )}
        keyExtractor={(item) => `${item.admMenuId}`}
      />
    );

    return !this.state.loading ? (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          {elements.length > 0 ? list : <Text>No se encontraron resultados</Text>}
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

export default AdmMenuScreen;
