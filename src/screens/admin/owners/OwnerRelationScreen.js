import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Clipboard, TouchableHighlight } from 'react-native';
import { Card, Text, Paragraph, IconButton, Snackbar } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { colors } from '../../../theme/appTheme';
import { urls } from '../../../services/api/afari';

class OwnerRelationScreen extends Component {
  static navigationOptions = {
    title: 'Propietarios'
  };

  state = {
    loading: false,
    building: {
      id: this.props.navigation.getParam('buildingId', 'No-Id'),
      name: this.props.navigation.getParam('buildingName', 'No-Name')
    },
    owners: [],
    snackbarVisible: false
  };

  _getOwners = async () => {
    let ownersUrl = `${urls.getPropietarios}?edificioId=${this.state.building.id}`;
    await fetch(ownersUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          let owners = parsedRes.lstPropietario;
          this.setState({ owners: owners });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  copyIconButtonHandler = (item) => {
    let clipboardString = ``;
    const info = `PROPIETARIO\n${item.nombrePropietario.trim()}\nParentesco: ${
      item.parentesco
    }\nCelular: ${item.celular != null ? item.celular : ''}\nTeléfono: ${
      item.telefono != null ? item.telefono : ''
    }\nEmail: ${item.email}`;
    if (item.nombreInquilino !== '') {
      const extraInfo = `\n-------------------------------\nINQUILINO\n${
        item.nombreInquilino
      }\nCelular: ${item.celularInquilino != null ? item.celularInquilino : ''}\nEmail: ${
        item.emailInquilino != null ? item.emailInquilino : ''
      }`;
      const mixedInfo = info.concat(extraInfo);
      clipboardString = mixedInfo;
    } else {
      clipboardString = info;
    }
    this.writeToClipboard(clipboardString);
  };

  onLabelPressHandler = async (text) => {
    await this.writeToClipboard(text);
    this.setState({ snackbarVisible: true });
  };

  writeToClipboard = async (content) => {
    await Clipboard.setString(content);
    this.setState({ snackbarVisible: true });
  };

  getAllData = async () => {
    this.setState({ loading: true });
    await this._getOwners();
    this.setState({ loading: false });
  };

  componentDidMount() {
    this.getAllData();
  }

  render() {
    const { owners } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <FlatList
        data={owners}
        style={styles.list}
        renderItem={({ item }) =>
          item.nombreInquilino !== '' ? (
            <Card style={styles.card}>
              <Card.Title
                title={item.nombreDepartamento}
                titleStyle={{ color: colors.afariGreen }}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="content-copy"
                    onPress={() => this.copyIconButtonHandler(item)}
                  />
                )}
              />
              <Card.Content>
                <Text style={{ color: colors.afariGreen, fontSize: 16 }}>Propietario</Text>
                <TouchableHighlight
                  onPress={() => this.onLabelPressHandler(item.nombrePropietario)}>
                  <Text>{item.nombrePropietario}</Text>
                </TouchableHighlight>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text>Parentesco</Text>
                  <TouchableHighlight onPress={() => this.onLabelPressHandler(item.parentesco)}>
                    <Paragraph>{item.parentesco}</Paragraph>
                  </TouchableHighlight>
                </View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text>Celular</Text>
                  <TouchableHighlight onPress={() => this.onLabelPressHandler(item.celular)}>
                    <Paragraph>{item.celular}</Paragraph>
                  </TouchableHighlight>
                </View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text>Teléfono</Text>
                  <TouchableHighlight onPress={() => this.onLabelPressHandler(item.telefono)}>
                    <Paragraph>{item.telefono}</Paragraph>
                  </TouchableHighlight>
                </View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text>Email</Text>
                  <TouchableHighlight onPress={() => this.onLabelPressHandler(item.email)}>
                    <Paragraph>{item.email}</Paragraph>
                  </TouchableHighlight>
                </View>
                <Text style={{ color: colors.afariYellow, fontSize: 16 }}>Inquilino</Text>
                <TouchableHighlight onPress={() => this.onLabelPressHandler(item.nombreInquilino)}>
                  <Text>{item.nombreInquilino}</Text>
                </TouchableHighlight>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text>Celular</Text>
                  <TouchableHighlight
                    onPress={() => this.onLabelPressHandler(item.celularInquilino)}>
                    <Paragraph>{item.celularInquilino}</Paragraph>
                  </TouchableHighlight>
                </View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text>Email</Text>
                  <TouchableHighlight onPress={() => this.onLabelPressHandler(item.emailInquilino)}>
                    <Paragraph>{item.emailInquilino}</Paragraph>
                  </TouchableHighlight>
                </View>
              </Card.Content>
            </Card>
          ) : (
            <Card style={styles.card}>
              <Card.Title
                title={item.nombreDepartamento}
                titleStyle={{ color: colors.afariGreen }}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="content-copy"
                    onPress={() => this.copyIconButtonHandler(item)}
                  />
                )}
              />
              <Card.Content>
                <Text style={{ color: colors.afariGreen, fontSize: 16 }}>Propietario</Text>
                <TouchableHighlight
                  onPress={() => this.onLabelPressHandler(item.nombrePropietario)}>
                  <Text>{item.nombrePropietario}</Text>
                </TouchableHighlight>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text>Parentesco</Text>
                  <TouchableHighlight onPress={() => this.onLabelPressHandler(item.parentesco)}>
                    <Paragraph>{item.parentesco}</Paragraph>
                  </TouchableHighlight>
                </View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text>Celular</Text>
                  <TouchableHighlight onPress={() => this.onLabelPressHandler(item.celular)}>
                    <Paragraph>{item.celular}</Paragraph>
                  </TouchableHighlight>
                </View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text>Teléfono</Text>
                  <TouchableHighlight onPress={() => this.onLabelPressHandler(item.telefono)}>
                    <Paragraph>{item.telefono}</Paragraph>
                  </TouchableHighlight>
                </View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text>Email</Text>
                  <TouchableHighlight onPress={() => this.onLabelPressHandler(item.email)}>
                    <Paragraph>{item.email}</Paragraph>
                  </TouchableHighlight>
                </View>
              </Card.Content>
            </Card>
          )
        }
        keyExtractor={(item) => `${item.propietarioId}`}
      />
    );

    return !this.state.loading ? (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          {this.state.owners.length > 0 ? list : <Text>No se encontraron resultados</Text>}
        </View>
        <Snackbar
          style={styles.snackbar}
          visible={this.state.snackbarVisible}
          duration={Snackbar.DURATION_SHORT}
          onDismiss={() => this.setState({ snackbarVisible: false })}>
          Datos copiados
        </Snackbar>
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
  snackbar: {
    backgroundColor: colors.background,
    marginLeft: 5
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
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

export default OwnerRelationScreen;
