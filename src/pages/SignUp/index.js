import React, { useState, useContext, useRef } from 'react';
import {
  Platform,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';

import { AuthContext } from '../../contexts/auth';

import {
  Background,
  Container,
  AreaInput,
  Input,
  SubmitButton,
  SubmitButtonText
} from '../SignIn/styles';

export default function SignIn() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPasword] = useState('');
  const { loadingAuth, signUp } = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  function handleSignUp() {
    signUp(email, password, nome);
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Background>
        <Container behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled>
          <AreaInput>
            <Input
              placeholder='Nome'
              autoCorrect={false}
              autoCapitalize='none'
              value={nome}
              onChangeText={text => setNome(text)}
              returnKeyType='next'
              keyboardType='email-address'
              onSubmitEditing={() => emailInputRef.current.focus()}
            />
          </AreaInput>

          <AreaInput>
            <Input
              ref={emailInputRef}
              placeholder='E-mail'
              autoCorrect={false}
              autoCapitalize='none'
              value={email}
              onChangeText={text => setEmail(text)}
              returnKeyType='next'
              onSubmitEditing={() => passwordInputRef.current.focus()}
            />
          </AreaInput>

          <AreaInput>
            <Input
              ref={passwordInputRef}
              placeholder='Senha'
              autoCorrect={false}
              autoCapitalize='none'
              value={password}
              onChangeText={text => setPasword(text)}
              secureTextEntry={true}
              returnKeyType='send'
              onSubmitEditing={handleSignUp}
            />
          </AreaInput>

          <SubmitButton onPress={handleSignUp}>
            {loadingAuth ? (
              <ActivityIndicator color='#fff' size={30} />
            ) : (
              <SubmitButtonText>Cadastrar</SubmitButtonText>
            )}
          </SubmitButton>
        </Container>
      </Background>
    </TouchableWithoutFeedback>
  );
}
