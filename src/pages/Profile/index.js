import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  Container,
  Nome,
  NewLink,
  NewLinkText,
  Logout,
  LogoutText
} from './styles';

import Header from '../../components/Header';
import { AuthContext } from '../../contexts/auth';

export default function Profile() {
  const { signOut, user } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <Container>
      <Header />
      <Nome>{user && user.nome}</Nome>
      <NewLink onPress={() => navigation.navigate('Register')}>
        <NewLinkText>Registrar gastos</NewLinkText>
      </NewLink>

      <Logout onPress={signOut}>
        <LogoutText>Sair</LogoutText>
      </Logout>
    </Container>
  );
}
