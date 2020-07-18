import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { List, Divider, Button, Text, Searchbar, TextInput } from 'react-native-paper';
import { SearchableFlatList } from 'react-native-searchable-list';
import { WaveIndicator } from 'react-native-indicators';
import { colors } from '../../../theme/appTheme';
import { urls } from '../../../services/api/afari';
import constants from '../../../utils/constants';
import { scaleVertical } from '../../../utils/scale';

class SendEmailScreen extends Component {
  static navigationOptions = {
    title: 'Enviar Email'
  };

  state = {
    isLoading: true,
    building: {
      id: this.props.navigation.getParam('buildingId', 'No-Id'),
      name: this.props.navigation.getParam('buildingName', 'No-Name')
    },
    recipients: [],
    recipientsExpanded: false,
    allChecked: true,
    ownersChecked: false,
    tenantChecked: false,
    searchTerm: '',
    searchAttribute: 'searchAttribute',
    aboutInputText: '',
    ccText: '',
    messageText: '',
    isFormValid: false,
    initialState: {}
  };

  _getRecipients = async () => {
    let recipientsUrl = `${urls.getPropiertarioInquilino}?edificioId=${this.state.building.id}`;
    await fetch(recipientsUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          let newRecipients = [];
          parsedRes.lstProInq.map((item) => {
            if (item.email != null) {
              let recipient = {
                id: item.Id,
                dpto: parseInt(
                  item.tipo === constants.ownerType.tenant
                    ? item.nombreDepartamento.split(' ')[1]
                    : item.nombreDepartamento
                ),
                email: item.email,
                nombre: item.nombre,
                type: item.tipo,
                checked: true,
                searchAttribute: `${parseInt(
                  item.tipo === constants.ownerType.tenant
                    ? item.nombreDepartamento.split(' ')[1]
                    : item.nombreDepartamento
                )} ${item.nombre}`
              };
              newRecipients.push(recipient);
            }
          });
          newRecipients.sort((x, y) => x.dpto - y.dpto);
          this.setState({
            recipients: newRecipients
          });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  _handleRecipientsExpandedPress = () => {
    this.setState({ recipientsExpanded: !this.state.recipientsExpanded });
  };

  _handleRecipientListItemPress = (id) => {
    const newRecipients = [...this.state.recipients];
    let index = newRecipients.findIndex((x) => x.id === id);
    newRecipients[index].checked = !newRecipients[index].checked;

    this.setState({ recipients: newRecipients });
  };

  _selectAllHandler = (value) => {
    this.setState({ allChecked: value });

    if (value) {
      this.setState({
        ownersChecked: !value,
        tenantChecked: !value
      });
    }
    const currentRecipients = [...this.state.recipients];
    const newRecipients = currentRecipients.map((x) => {
      let receipt = x;
      receipt.checked = value;
      return receipt;
    });
    this.setState({ recipients: newRecipients });
  };

  _selectOwnersHandler = (value) => {
    this.setState({ ownersChecked: value });

    if (value) {
      this.setState({
        allChecked: !value,
        tenantChecked: !value
      });
    }
    const currentRecipients = [...this.state.recipients];
    const newRecipients = currentRecipients.map((x) => {
      let receipt = x;
      receipt.checked = receipt.type === constants.ownerType.owner ? value : false;
      return receipt;
    });
    this.setState({ recipients: newRecipients });
  };

  _selectTenantHandler = (value) => {
    this.setState({ tenantChecked: value });

    if (value) {
      this.setState({
        allChecked: !value,
        ownersChecked: !value
      });
    }
    const currentRecipients = [...this.state.recipients];
    const newRecipients = currentRecipients.map((x) => {
      let receipt = x;
      receipt.checked = receipt.type === constants.ownerType.tenant ? value : false;
      return receipt;
    });
    this.setState({ recipients: newRecipients });
  };

  _getAllData = async () => {
    this.setState({ isLoading: true });

    await this._getRecipients();

    this.setState({ isLoading: false });
  };

  _isFormValid = () => {
    const { aboutInputText, messageText, recipients } = this.state;

    return aboutInputText !== '' && messageText !== '' && recipients.length > 0;
  };

  _resetState = () => {
    const initState = this.state.initialState;
    this.setState(initState);
  };

  _sendEmail = async () => {
    if (this._isFormValid()) {
      this.setState({ isLoading: true });
      const userId = await AsyncStorage.getItem(constants.user.userId);
      const newRecipients = this.state.recipients
        .filter((x) => x.checked)
        .map((y) => {
          let recipient = {
            dpto: y.dpto,
            email: y.email,
            nombre: y.nombre
          };
          return recipient;
        });

      const emailBody = {
        usuarioId: parseInt(userId),
        edificioId: parseInt(this.state.building.id),
        asunto: this.state.aboutInputText,
        mensaje: this.state.messageText,
        cc: this.state.ccText,
        lstDestinatarioCorreo: newRecipients
      };

      try {
        await fetch(urls.postEmail, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailBody)
        })
          .then((response) => response.json())
          .then((parsedRes) => {
            if (parsedRes.error) {
              this.setState({ isLoading: false });
              Alert.alert(parsedRes.mensaje);
            } else {
              this._resetState();
              this.setState({ isLoading: false });
              Alert.alert('Correo enviado');
            }
          })
          .catch((error) => {
            Alert.alert('Error', error);
            this.setState({ isLoading: false });
          });
      } catch (error) {
        Alert.alert('Error', error);
      }
    } else {
      Alert.alert('Error', 'Formulario no valido.');
    }
  };

  componentDidMount() {
    this._getAllData();
    const initState = this.state;
    this.setState({ initialState: initState });
  }

  componentDidUpdate() {
    if (!this.state.isFormValid) {
      if (this._isFormValid()) {
        this.setState({ isFormValid: true });
      }
    } else {
      if (!this._isFormValid()) {
        this.setState({ isFormValid: false });
      }
    }
  }

  render() {
    const { recipients, recipientsExpanded, searchTerm, searchAttribute } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <KeyboardAvoidingView style={styles.screen} behavior="padding">
        <View style={styles.list}>
          <Searchbar
            placeholder="Buscar"
            style={styles.searchbar}
            onChangeText={(searchTerm) => {
              this.setState({ searchTerm });
            }}
            value={searchTerm}
          />
          <SearchableFlatList
            data={recipients}
            style={styles.list}
            searchTerm={searchTerm}
            searchAttribute={searchAttribute}
            ignoreCase={true}
            maxToRenderPerBatch={20}
            initialNumToRender={20}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={`${item.dpto} - ${item.nombre}`}
                  titleStyle={{
                    color:
                      item.type === constants.ownerType.owner ? colors.afariLightBlue : '#fff2c0'
                  }}
                  style={{ marginLeft: 0 }}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      color={colors.afariGreen}
                      style={styles.listItemIcon}
                      icon={item.checked ? 'check-box' : 'check-box-outline-blank'}
                    />
                  )}
                  onPress={() => this._handleRecipientListItemPress(item.id)}
                />
                <Divider />
              </View>
            )}
            keyExtractor={(item) => `${item.id}`}
          />
        </View>
      </KeyboardAvoidingView>
    );

    return !this.state.isLoading ? (
      <KeyboardAvoidingView style={styles.screen} behavior="padding">
        <ScrollView
          style={styles.container}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always">
          <List.Accordion
            title="Destinatarios"
            expanded={recipientsExpanded}
            style={{ marginTop: 5 }}
            onPress={() => this._handleRecipientsExpandedPress()}>
            <List.Section>
              <List.Item
                title="Todos"
                style={{ paddingVertical: 0 }}
                left={(props) => (
                  <List.Icon
                    {...props}
                    color={colors.afariGreen}
                    style={styles.listItemIcon}
                    icon={this.state.allChecked ? 'check-box' : 'check-box-outline-blank'}
                  />
                )}
                onPress={() => this._selectAllHandler(!this.state.allChecked)}
              />
              <List.Item
                title="Propietarios"
                style={{ paddingVertical: 0 }}
                left={(props) => (
                  <List.Icon
                    {...props}
                    color={colors.afariGreen}
                    style={styles.listItemIcon}
                    icon={this.state.ownersChecked ? 'check-box' : 'check-box-outline-blank'}
                  />
                )}
                right={(props) => (
                  <List.Icon
                    {...props}
                    color={colors.afariLightBlue}
                    style={styles.listItemIcon}
                    icon="account-box"
                  />
                )}
                onPress={() => this._selectOwnersHandler(!this.state.ownersChecked)}
              />
              <List.Item
                title="Inquilinos"
                style={{ paddingVertical: 0 }}
                left={(props) => (
                  <List.Icon
                    {...props}
                    color={colors.afariGreen}
                    style={styles.listItemIcon}
                    icon={this.state.tenantChecked ? 'check-box' : 'check-box-outline-blank'}
                  />
                )}
                right={(props) => (
                  <List.Icon
                    {...props}
                    color="#fff2c0"
                    style={styles.listItemIcon}
                    icon="account-box"
                  />
                )}
                onPress={() => this._selectTenantHandler(!this.state.tenantChecked)}
              />
            </List.Section>
            <List.Section>
              {this.state.recipients.length > 0 ? list : <Text>No se encontraron resultados.</Text>}
            </List.Section>
          </List.Accordion>
          <View style={styles.listContainer}>
            <TextInput
              mode="flat"
              label="Asunto"
              style={styles.input}
              onChangeText={(text) => this.setState({ aboutInputText: text })}
              value={this.state.aboutInputText}
              autoCorrect={true}
            />
            <TextInput
              mode="flat"
              label="CC"
              multiline={true}
              style={styles.input}
              onChangeText={(text) => this.setState({ ccText: text })}
              value={this.state.ccText}
              autoCorrect={false}
            />
            <Text style={{ marginLeft: 10, marginTop: 10 }}>
              Separar por coma. Ejemplo: 123@hotmail.com<Text style={{ color: 'red' }}>,</Text>
              654@gmail.com
            </Text>
            <TextInput
              mode="flat"
              label="Mensaje"
              multiline={true}
              style={styles.input}
              onChangeText={(text) => this.setState({ messageText: text })}
              value={this.state.messageText}
              autoCorrect={false}
            />
            <Button
              style={styles.button}
              mode="outlined"
              disabled={!this.state.isFormValid}
              onPress={() => this._sendEmail()}>
              Enviar
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    ) : (
      <View style={styles.loadingContainer}>{spinner}</View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'transparent',
    marginTop: scaleVertical(25),
    borderColor: 'white',
    color: 'white',
    borderRadius: 5,
    marginHorizontal: 5
  },
  listContainer: {
    justifyContent: 'center'
    //alignItems: 'center'
  },
  list: {
    marginTop: 5,
    width: '100%'
  },
  input: {
    marginTop: scaleVertical(10),
    backgroundColor: 'transparent'
  },
  searchbar: {
    backgroundColor: colors.background
  }
});

export default SendEmailScreen;
