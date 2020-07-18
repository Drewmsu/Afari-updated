import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Paragraph } from 'react-native-paper';
import { colors } from '../../theme/appTheme';

class CloseFeesCardItem extends PureComponent {
  render() {
    const { title, isPayed, timeUnit, isPrePayment, total } = this.props;
    return (
      <Card style={styles.card}>
        <Card.Title title={title} titleStyle={{ color: colors.afariGreen }} />
        <Card.Content>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text>Estado</Text>
            <Paragraph style={{ color: isPayed ? colors.afariGreen : colors.accent }}>
              {isPayed ? 'Pagado' : 'Sin Pagar'}
            </Paragraph>
          </View>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text>Unidad de Tiempo</Text>
            <Paragraph>{timeUnit}</Paragraph>
          </View>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text>Es Pago Adelantado</Text>
            <Paragraph>{isPrePayment != null ? 'Si' : 'No'}</Paragraph>
          </View>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text>Total</Text>
            <Paragraph>{total}</Paragraph>
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

export default CloseFeesCardItem;
