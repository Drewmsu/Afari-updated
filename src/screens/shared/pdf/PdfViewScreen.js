import React, { Component } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Platform, Dimensions } from 'react-native';
import { FileSystem, Permissions } from 'react-native-unimodules';
import * as MediaLibrary from 'expo-media-library';
import PDFReader from 'react-native-pdf';
import { colors } from '../../../theme/appTheme';
import constants from '../../../utils/constants';

class PdfViewScreen extends Component {
  static navigationOptions = {
    title: 'PDF'
  };

  state = {
    downloadUri: this.props.navigation.getParam('downloadUri', 'No-Uri'),
    fileName: this.props.navigation.getParam('fileName', 'No-FileName'),
    viewType: this.props.navigation.getParam('type', 'No-Type'),
    type: 'pdf',
    uri: null
  };

  _setType = async () => {
    switch (this.state.viewType) {
      case constants.viewType.pdf:
        this.setState({ type: 'pdf' });
        break;
      case constants.viewType.web:
        this.setState({ type: 'web' });
        break;
      default:
        this.setState({ type: 'pdf' });
        break;
    }
  };

  _downloadMaitanceRecipt = async () => {
    const { downloadUri, fileName } = this.state;

    if (Platform.OS === 'ios') {
      const RNFS = require('react-native-fs');

      const finalDownloadUri = downloadUri.replace(/ /g, '%20');
      const finalFileName = fileName.replace(/ /g, '_');

      const path = RNFS.DocumentDirectoryPath + '/' + finalFileName;

      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === 'granted') {
        RNFS.downloadFile({
          fromUrl: finalDownloadUri,
          toFile: path
        })
          .promise.then(async (response) => {
            if (response.statusCode === 200) {
              this.setState({ uri: path });
            } else {
              this.props.navigation.goBack();
              Alert.alert('Lo Sentimos', 'Documento no disponible por el momento');
            }
          })
          .catch((error) => {
            this.props.navigation.goBack();
            Alert.alert('Error', error.toString());
          });
      } else {
        this.props.navigation.goBack();
        throw new Error('Se necesita que autorice el permiso de CAMERA_ROLL');
      }
    } else {
      await FileSystem.downloadAsync(downloadUri, FileSystem.documentDirectory + fileName)
        .then(async (response) => {
          if (response.status === 200) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status === 'granted') {
              const { uri: mediaUri } = await MediaLibrary.createAssetAsync(response.uri);
              this.setState({ uri: mediaUri });
            } else {
              this.props.navigation.goBack();
              throw new Error('Se necesita que autorice el permiso de CAMERA_ROLL');
            }
          } else {
            this.props.navigation.goBack();
            Alert.alert('Lo Sentimos', 'Documento no disponible por el momento');
          }
        })
        .catch((error) => {
          this.props.navigation.goBack();
          Alert.alert('Error', error.toString());
        });
    }
  };

  componentDidMount() {
    this._setType();
    this._downloadMaitanceRecipt();
  }
  render() {
    let spinner = <ActivityIndicator size="large" color={colors.afariGreen} />;
    return this.state.uri ? (
      <View style={styles.container}>
        <PDFReader
          source={{ uri: this.state.uri }}
          onError={(error) => {
            Alert.alert('Error', error);
          }}
          style={styles.pdf}
        />
        {/* {this.state.type === 'pdf' ? (
          <PDFReader
            source={{ uri: this.state.uri }}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`current page: ${page}`);
            }}
            onError={error => {
              console.log(error);
            }}
            style={styles.pdf}
          />
        ) : (
          <WebView
            source={{
              uri:
                'https://drive.google.com/viewerng/viewer?embedded=true&url=' +
                this.state.downloadUri
            }}
          />
        )} */}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width
  }
});

export default PdfViewScreen;
