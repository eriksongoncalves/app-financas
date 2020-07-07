import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableWithoutFeedback } from 'react-native';

import { Container, Tipo, IconView, TipoText, ValorText } from './styles';
import { formatMoney } from '../../utils/money';

export default function HistoricoList({ data, deleteItem }) {
  const { tipo, valor } = data;
  const iconName = tipo === 'despesa' ? 'arrow-down' : 'arrow-up';

  return (
    <TouchableWithoutFeedback onLongPress={() => deleteItem(data)}>
      <Container>
        <Tipo>
          <IconView tipo={tipo}>
            <Icon name={iconName} color='#fff' size={20} />
            <TipoText>{tipo}</TipoText>
          </IconView>
        </Tipo>
        <ValorText>{formatMoney(valor)}</ValorText>
      </Container>
    </TouchableWithoutFeedback>
  );
}
