import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  Button,
  ImageBackground,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { auth } from '../../../../config/firebase';
import { IUser, StackProps } from '../../../routes';
import { styles } from './styles';

export function SignIn({
  route,
  navigation,
  setAuthorizedUser,
}: Omit<IUser, 'authorizedUser'> & StackProps) {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [errorMessage, setErrorMessages] = useState<string>();

  const image = require('../../../.././assets/topographic.png');

  const signInWithPassword = async () => {
    console.log({ email, password });
    signInWithEmailAndPassword(auth, email!, password!)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        if (user) {
          user.getIdToken().then(async (tkn) => {
            // set access token in session storage
            await AsyncStorage.setItem('accessToken', tkn);

            setAuthorizedUser(true);
            setEmail('');
            setPassword('');
          });
        }
      })
      .catch((error) => {
        setErrorMessages(getErrorMessgages(error.message, password));

        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.image} source={image} resizeMode='cover'>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(value) => setEmail(value)}
          placeholder='Email'
          placeholderTextColor={'black'}
          autoCapitalize='none'
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(value) => setPassword(value)}
          placeholder='Password'
          placeholderTextColor={'black'}
          autoCapitalize='none'
          secureTextEntry={true}
        />
        <Text style={styles.error}>{errorMessage}</Text>
        <Pressable style={styles.button} onPress={signInWithPassword}>
          <Text style={styles.text}>Sign In</Text>
        </Pressable>
        <Button title='Create an account' onPress={() => navigation.navigate('SignUp')} />
      </ImageBackground>
    </View>
  );
}

const getErrorMessgages = (error: string | undefined, password: string | undefined) => {
  console.log(error);
  if (error === undefined) return '';

  if (error.includes('missing-email')) {
    return 'There was no email provided. Please enter one.';
  } else if (error.includes('missing-password') || password === undefined) {
    return 'There was no password provided. Please enter one.';
  } else if (error.includes('invalid-email')) {
    return 'The email entered does not exist. Please try again.';
  } else if (error.includes('wrong-password')) {
    return 'The password entered was incorrect. Please try again.';
  }

  return error;
};
