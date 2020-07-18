import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Paragraph } from 'react-native-paper';
import { WaveIndicator } from 'react-native-indicators';
import { colors } from '../../../theme/appTheme';
import { urls } from '../../../services/api/afari';

class NewsScreen extends Component {
  static navigationOptions = {
    title: 'Noticias'
  };

  state = {
    loading: false,
    building: {
      id: this.props.navigation.getParam('buildingId', 'No-Id'),
      name: this.props.navigation.getParam('buildingName', 'No-Name')
    },
    news: []
  };

  _getNews = async () => {
    let newsUrl = `${urls.getNoticias}?edificioId=${this.state.building.id}`;
    await fetch(newsUrl)
      .then((res) => res.json())
      .then((parsedRes) => {
        if (parsedRes.error) {
          alert(parsedRes.mensaje);
        } else {
          let news = parsedRes.lstNoticia;
          this.setState({ news: news });
        }
      })
      .catch((error) => {
        alert('Error', error);
      });
  };

  //Fetch Data for the first time
  getAllData = async () => {
    this.setState({ loading: true });
    await this._getNews();
    this.setState({ loading: false });
  };

  componentDidMount() {
    this.getAllData();
  }

  render() {
    const { news } = this.state;
    let spinner = <WaveIndicator color={colors.afariGreen} size={100} />;
    let list = (
      <FlatList
        data={news}
        style={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.titulo} titleStyle={{ color: colors.afariGreen }} />
            <Card.Content>
              <Paragraph>{item.detalle}</Paragraph>
              <Paragraph>{item.fecha}</Paragraph>
            </Card.Content>
          </Card>
        )}
        keyExtractor={(item) => `${item.noticiaId}`}
      />
    );

    return !this.state.loading ? (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          {this.state.news.length > 0 ? list : <Text>No se encontraron resultados</Text>}
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

export default NewsScreen;
