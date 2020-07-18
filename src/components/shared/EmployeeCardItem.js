import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Paragraph } from 'react-native-paper';
import { colors } from '../../theme/appTheme';

class EmployeeCardItem extends PureComponent {
  render() {
    const { charge, name, dni } = this.props;
    return (
      <Card style={styles.card}>
        <Card.Title
          title={charge}
          titleStyle={{ color: colors.afariGreen }}
          //   left={props => <Avatar.Image {...props} source={{ uri: image }} />}
        />
        <Card.Content>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text>Nombre</Text>
            <Paragraph>{name}</Paragraph>
          </View>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text>DNI</Text>
            <Paragraph>{dni}</Paragraph>
          </View>
        </Card.Content>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    margin: 5,
    elevation: 5,
    shadowOpacity: 0.5
  }
});

export default EmployeeCardItem;
