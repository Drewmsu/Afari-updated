import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../../../theme/appTheme';

class SaleAndRentalDisplayItem extends PureComponent {
  render() {
    const {
      name,
      description,
      img,
      type,
      roomCount,
      bathCount,
      parkCount,
      area,
      onPress
    } = this.props;

    return (
      <Card style={styles.container}>
        <Card.Title title={type} titleStyle={styles.title} />
        <TouchableOpacity onPress={onPress}>
          <Card.Cover source={{ uri: img }} />
        </TouchableOpacity>
        <Card.Content>
          <Title>{name}</Title>
          <Paragraph>{description}</Paragraph>
        </Card.Content>
        <Card.Content style={styles.iconsContainer}>
          <View style={styles.iconPair}>
            <FontAwesome name="bed" size={24} style={styles.icon} />
            <Text style={styles.iconText}>{roomCount}</Text>
          </View>
          <View style={styles.iconPair}>
            <FontAwesome name="bath" size={24} style={styles.icon} />
            <Text style={styles.iconText}>{bathCount}</Text>
          </View>
          <View style={styles.iconPair}>
            <FontAwesome name="car" size={24} style={styles.icon} />
            <Text style={styles.iconText}>{parkCount}</Text>
          </View>
          <View style={styles.iconPair}>
            <FontAwesome name="home" size={24} style={styles.icon} />
            <Text style={styles.iconText}>{area}</Text>
          </View>
        </Card.Content>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 4
  },
  title: {
    color: colors.afariGreen
  },
  iconsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between'
  },
  iconPair: {
    flexDirection: 'row'
  },
  icon: {
    color: colors.afariLightBlue,
    marginRight: 5
  },
  iconText: {
    fontSize: 18,
    marginTop: 4
  }
});

export default SaleAndRentalDisplayItem;
