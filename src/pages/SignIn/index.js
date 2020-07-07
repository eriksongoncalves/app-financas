import React, { useState, useContext, useRef } from 'react';
import {
  Platform,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  Background,
  Container,
  Logo,
  AreaInput,
  Input,
  SubmitButton,
  SubmitButtonText,
  Link,
  LinkText
} from './styles';

import { AuthContext } from '../../contexts/auth';

export default function SignIn() {
  const navigation = useNavigation();
  const passwordInputRef = useRef();
  const { loadingAuth, signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPasword] = useState('');

  function handleLogin() {
    signIn(email, password);
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Background>
        <Container behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled>
          <Logo source={require('../../assets/Logo.png')} />

          <AreaInput>
            <Input
              placeholder='E-mail'
              autoCorrect={false}
              autoCapitalize='none'
              value={email}
              onChangeText={text => setEmail(text)}
              keyboardType='email-address'
              returnKeyType='next'
              onSubmitEditing={() => passwordInputRef.current.focus()}
            />
          </AreaInput>

          <AreaInput>
            <Input
              placeholder='Senha'
              autoCorrect={false}
              autoCapitalize='none'
              value={password}
              ref={passwordInputRef}
              onChangeText={text => setPasword(text)}
              secureTextEntry={true}
              returnKeyType='send'
              onSubmitEditing={handleLogin}
            />
          </AreaInput>

          <SubmitButton onPress={handleLogin}>
            {loadingAuth ? (
              <ActivityIndicator color='#fff' size={30} />
            ) : (
              <SubmitButtonText>Acessar</SubmitButtonText>
            )}
          </SubmitButton>

          <Link
            onPress={() => {
              navigation.navigate('SignUp');
            }}
          >
            <LinkText>Criar uma conta</LinkText>
          </Link>
        </Container>
      </Background>
    </TouchableWithoutFeedback>
  );
}
