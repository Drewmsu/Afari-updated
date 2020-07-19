import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { List, Button, Text, IconButton } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { Dropdown } from 'react-native-material-dropdown-v2';
import ImageView from 'react-native-image-view';
import SellAndRentalDisplayItem from '../../../components/shared/SaleAndRental/SaleAndRentalDisplayItem';
import { colors, appTheme } from '../../../theme/appTheme';
import { dropdownStyles } from '../../../theme/shared';
import { urls } from '../../../services/api/afari';

const categorias = [
  { id: '', value: 'Seleccione' },
  { id: 'DWJ2EDE4YK6SLSJ6', value: 'Alquiler' },
  { id: 'CTYJES6FQ9J4LM6R', value: 'Venta' }
];

class SellAndRentalScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Venta y Alquiler Inmuebles',
      headerRight: <IconButton icon="reply" onPress={navigation.getParam('logout')} />
    };
  };

  state = {
    firstLoading: false,
    listLoading: false,
    expanded: false,
    departamentos: [],
    provincias: [],
    distritos: [],
    categorias: categorias,
    selectedDepartamento: { id: '', value: 'Seleccione' },
    selectedProvincia: { id: '', value: 'Seleccione' },
    selectedDistrito: { id: '', value: 'Seleccione' },
    selectedCategoria: { id: '', value: 'Seleccione' },
    items: [],
    images: [],
    isImageViewVisible: false,
    imagesCount: 0,
    imageIndex: 0
  };

  _getDepartamentos = async () => {
    let departamentosUrl = `${urls.web.getDepartamentos}`;
    await fetch(departamentosUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          let departamentos = [];
          departamentos.push(this.state.selectedDepartamento);
          parsedRes.lstDepartamento.map((item) => {
            let departamento = {
              id: item.UUID,
              value: item.Nombre
            };
            departamentos.push(departamento);
          });
          this.setState({
            departamentos: departamentos,
            selectedDepartamento: departamentos[0]
          });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  _getProvincias = async () => {
    let provinciasUrl = `${urls.web.getProvincias}`;
    await fetch(provinciasUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          let provincias = [];
          provincias.push(this.state.selectedProvincia);
          parsedRes.lstProvincia.map((item) => {
            let provincia = {
              id: item.UUID,
              value: item.Nombre
            };
            provincias.push(provincia);
          });
          this.setState({
            provincias: provincias,
            selectedProvincia: provincias[0]
          });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  _getDistritos = async () => {
    let distritosUrl = `${urls.web.getDistritos}?codDepartamento=&codProvincia=`;
    await fetch(distritosUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          let distritos = [];
          let auxDistritos = [];
          distritos.push(this.state.selectedDistrito);
          parsedRes.lstDistrito.map((item) => {
            let distrito = {
              id: item.UUID,
              value: item.Nombre
            };
            auxDistritos.push(distrito);
          });
          auxDistritos.sort((a, b) => {
            //Order by name
            let nameA = a.value.toUpperCase();
            let nameB = b.value.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          });
          let finalDistritos = distritos.concat(auxDistritos);
          this.setState({
            distritos: finalDistritos,
            selectedDistrito: finalDistritos[0]
          });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  _getSales = async () => {
    //?uuidDepartamento=&uuidProvincia=&uuidDistrito=&uuiCategoria=
    let url = `${urls.web.getVentaAlquiler}?uuidDepartamento=${this.state.selectedDepartamento.id}&uuidProvincia=${this.state.selectedProvincia.id}&uuidDistrito=${this.state.selectedDistrito.id}&uuiCategoria=${this.state.selectedCategoria.id}`;
    await fetch(url)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          const sales = parsedRes.lstEdificio;
          this.setState({ items: sales });
        }
      });
  };

  //Fetch Data for the first time
  _getAllData = async () => {
    this.setState({ firstLoading: true });
    await this._getDepartamentos();
    await this._getProvincias();
    await this._getDistritos();
    await this._getSales();
    this.setState({ firstLoading: false });
  };

  //Fetch data when filter is applied
  _getListHandler = async () => {
    //fetch here after filters
    this.setState({ listLoading: true });
    await this._getSales();
    this.setState({ listLoading: false });
  };

  onDepartamentoDropdownChange = (value) => {
    let selectedDepartamento = this.state.departamentos.find((x) => x.value === value);
    this.setState({ selectedDepartamento: selectedDepartamento });
  };

  onProvinciaDropdownChange = (value) => {
    let selectedProvincia = this.state.provincias.find((x) => x.value === value);
    this.setState({ selectedProvincia: selectedProvincia });
  };

  onDistritoDropdownChange = (value) => {
    let selectedDistrito = this.state.distritos.find((x) => x.value === value);
    this.setState({ selectedDistrito: selectedDistrito });
  };

  onCategoriaDropdownChange = (value) => {
    let selectedCategoria = this.state.categorias.find((x) => x.value === value);
    this.setState({ selectedCategoria: selectedCategoria });
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

  _signoutHandler = async () => {
    await AsyncStorage.clear();
    //Fetch Logout
    this.props.navigation.navigate('Auth');
  };

  _signoutPressHandler = () => {
    Alert.alert('Cerrar Sesión', '¿Está seguro de cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aceptar',
        onPress: () => this._signoutHandler()
      }
    ]);
  };

  _setImages = (imageString) => {
    if (imageString != null && imageString != '') {
      this.setState({ images: [] });
      const imgArray = imageString.split('|');
      const images = imgArray.map((text) => {
        return {
          source: {
            uri: `http://afari.pe${text}`
          },
          title: '',
          width: 400,
          height: 600
        };
      });
      this.setState({
        images: images,
        isImageViewVisible: true,
        imagesCount: images.length
      });
    }
  };

  _closeImageView = () => {
    this.setState({ isImageViewVisible: false });
  };

  componentDidMount() {
    this.props.navigation.setParams({ logout: this._signoutPressHandler });
    this._getAllData();
  }

  renderFooter = () => {
    const { imagesCount, imageIndex } = this.state;
    return (
      <View style={styles.infoContainer}>
        <View style={styles.pagerContainer}>
          <Text style={{ fontWeight: 'bold' }}>
            {imageIndex + 1} / {imagesCount}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={{ fontWeight: 'bold' }}>Asesora Inmobiliaria</Text>
          <Text>Katherine Romero Wendorff</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={{ fontWeight: 'bold' }}>Email</Text>
          <Text>katherine.romero@afari.pe</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={{ fontWeight: 'bold' }}>Celular</Text>
          <Text>986663788</Text>
        </View>
      </View>
    );
  };

  render() {
    const {
      departamentos,
      provincias,
      distritos,
      categorias,
      images,
      isImageViewVisible,
      imageIndex
    } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <FlatList
        data={this.state.items}
        style={styles.list}
        renderItem={({ item }) => (
          <SellAndRentalDisplayItem
            name={item.Nombre}
            description={item.Descripcion}
            img={
              item.Imagen != null && item.Imagen != ''
                ? `http://afari.pe${item.Imagen}`
                : 'http://afari.pe/bitportal/Cms_Data/Sites/VEH/Files/images/logo-afari.png'
            }
            type={item.Categoria === 'DWJ2EDE4YK6SLSJ6' ? 'Alquiler' : 'Venta'}
            bathCount={item.Banio}
            roomCount={item.Dormitorio}
            parkCount={item.Estacionamiento}
            area={`${item.Area} m2`}
            onPress={() => this._setImages(item.Imagenes)}
          />
        )}
        keyExtractor={(item) => `${item.UUID}`}
      />
    );

    let info = (
      <View style={[styles.infoContainer, { paddingHorizontal: 4 }]}>
        <View style={styles.infoItem}>
          <Text style={{ fontWeight: 'bold' }}>Asesora Inmobiliaria</Text>
          <Text>Katherine Romero Wendorff</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={{ fontWeight: 'bold' }}>Email</Text>
          <Text>katherine.romero@afari.pe</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={{ fontWeight: 'bold' }}>Celular</Text>
          <Text>986663788</Text>
        </View>
      </View>
    );

    return !this.state.firstLoading ? (
      <View style={styles.container}>
        {info}
        <List.Accordion
          title="Filtros"
          expanded={this.state.expanded}
          onPress={() => this._handleExpandedPress()}
          left={(props) => <List.Icon {...props} icon="filter-variant" />}>
          <Dropdown
            label="Categoria"
            data={categorias}
            textColor={colors.white}
            baseColor={colors.white}
            pickerStyle={dropdownStyles.dropdownPickerStyle}
            dropdownOffset={{ top: 16, left: 0 }}
            itemColor={appTheme.colors.placeholder}
            itemCount={8}
            value={this.state.selectedCategoria.value}
            onChangeText={(value) => this.onCategoriaDropdownChange(value)}
          />
          <Dropdown
            label="Departamento"
            data={departamentos}
            textColor={colors.white}
            baseColor={colors.white}
            pickerStyle={dropdownStyles.dropdownPickerStyle}
            dropdownOffset={{ top: 16, left: 0 }}
            itemColor={appTheme.colors.placeholder}
            itemCount={8}
            value={this.state.selectedDepartamento.value}
            onChangeText={(value) => this.onDepartamentoDropdownChange(value)}
          />
          <Dropdown
            label="Provincia"
            data={provincias}
            textColor={colors.white}
            baseColor={colors.white}
            pickerStyle={dropdownStyles.dropdownPickerStyle}
            dropdownOffset={{ top: 16, left: 0 }}
            itemColor={appTheme.colors.placeholder}
            itemCount={8}
            value={this.state.selectedProvincia.value}
            onChangeText={(value) => this.onProvinciaDropdownChange(value)}
          />
          <Dropdown
            label="Distrito"
            data={distritos}
            textColor={colors.white}
            baseColor={colors.white}
            pickerStyle={dropdownStyles.dropdownPickerStyle}
            dropdownOffset={{ top: 16, left: 0 }}
            itemColor={appTheme.colors.placeholder}
            itemCount={8}
            value={this.state.selectedDistrito.value}
            onChangeText={(value) => this.onDistritoDropdownChange(value)}
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
            this.state.items.length > 0 ? (
              list
            ) : (
              <Text>No se encontraron resultados</Text>
            )
          ) : (
            spinner
          )}
        </View>
        <ImageView
          images={images}
          imageIndex={imageIndex}
          animationType="fade"
          isVisible={isImageViewVisible}
          renderFooter={this.renderFooter}
          onClose={() => this._closeImageView()}
          onImageChange={(index) => this.setState({ imageIndex: index })}
        />
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
  infoContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  infoItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 5
  },
  pagerContainer: {
    alignItems: 'center',
    paddingBottom: 10
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

export default SellAndRentalScreen;
