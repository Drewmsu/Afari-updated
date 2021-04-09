import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Paragraph, Avatar } from 'react-native-paper';
import { colors } from '../../theme/appTheme';

class EmployeeCardItem extends PureComponent {
  render() {
    const { charge, name, dni, image } = this.props;
    return (
      <Card style={styles.card}>
        <Card.Title
          title={charge}
          titleStyle={{ color: colors.afariGreen, marginLeft: 8 }}
          left={(props) => <Avatar.Image {...props} source={{ uri: image }} size={54} />}
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
