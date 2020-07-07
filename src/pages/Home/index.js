import React, { useState, useContext, useEffect } from 'react';
import { format, isBefore } from 'date-fns';
import { Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  Background,
  Container,
  Nome,
  Saldo,
  Title,
  List,
  Area
} from './styles';

import firebase from '../../services/firebaseConnection';
import { formatMoney } from '../../utils/money';
import Header from '../../components/Header';
import HistoricoList from '../../components/HistoricoList';
import DatePicker from '../../components/DatePicker';

import { AuthContext } from '../../contexts/auth';

export default function Home() {
  const { user } = useContext(AuthContext);
  const [historico, setHistorico] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [newDate, setNewDate] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function loadList() {
      const { uid } = user;

      await firebase
        .database()
        .ref('users')
        .child(uid)
        .on('value', snapshot => {
          setSaldo(snapshot.val().saldo);
        });

      await firebase
        .database()
        .ref('historico')
        .child(uid)
        .orderByChild('date')
        .equalTo(format(newDate, 'dd/MM/yyyy'))
        .limitToLast(10)
        .on('value', snapshot => {
          setHistorico([]);
          snapshot.forEach(childItem => {
            let list = {
              key: childItem.key,
              tipo: childItem.val().tipo,
              valor: childItem.val().valor,
              date: childItem.val().date
            };

            setHistorico(oldArray => [...oldArray, list].reverse());
          });
        });
    }

    loadList();
  }, [newDate]);

  function handleDelete(data) {
    const dateItem = new Date(format(new Date(data.date), 'yyyy/MM/dd'));
    const dateNow = new Date(format(new Date(), 'yyyy/MM/dd'));

    if (isBefore(dateItem, dateNow)) {
      alert('Você não pode excluir um registro antigo');
      return;
    }

    Alert.alert(
      'Atenção!',
      `Você deseja excluir ${data.tipo} - Valor: ${formatMoney(data.valor)}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Continuar',
          onPress: () => handleDeleteSuccess(data)
        }
      ]
    );
  }

  function handleShowPicker() {}

  async function handleDeleteSuccess(data) {
    const { uid } = user;
    await firebase
      .database()
      .ref('historico')
      .child(uid)
      .child(data.key)
      .remove()
      .then(async () => {
        let saldoAtual = saldo;

        data.tipo === 'despesa'
          ? (saldoAtual += parseFloat(data.valor))
          : (saldoAtual -= parseFloat(data.valor));

        await firebase
          .database()
          .ref('users')
          .child(uid)
          .child('saldo')
          .set(saldoAtual);
      })
      .catch(error => {
        alert(error.code);
      });
  }

  function handleShowPicker() {
    setShow(true);
  }

  function handleClose() {
    setShow(false);
  }

  const onChange = date => {
    setShow(Platform.OS === 'ios');
    setNewDate(date);
    console.log(date);
  };

  return (
    <Background>
      <Header />
      <Container>
        <Nome>{user && user.nome}</Nome>
        <Saldo>{formatMoney(saldo)}</Saldo>
      </Container>

      <Area>
        <TouchableOpacity onPress={handleShowPicker}>
          <Icon name='event' color='#FFF' size={30} />
        </TouchableOpacity>
        <Title>Ultimas movimentações</Title>
      </Area>

      <List
        showsVerticalScrollIndicator={false}
        data={historico}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <HistoricoList data={item} deleteItem={handleDelete} />
        )}
      />

      {show && (
        <DatePicker onClose={handleClose} date={newDate} onChange={onChange} />
      )}
    </Background>
  );
}
