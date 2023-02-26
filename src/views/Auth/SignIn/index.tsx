import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Button, ImageBackground, Pressable, SafeAreaView, Text, TextInput } from 'react-native';
import { auth } from '../../../../config/firebase';
import { IUser, StackProps } from '../../../routes';
import { styles } from './styles';

export function SignIn({
  route,
  navigation,
  setAuthorizedUser,
}: Omit<IUser, 'authorizedUser'> & StackProps) {
  // eminmammadzada.b@gmail.com
  // admin123
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const image = require('../../../.././assets/topographic.png');

  const signInWithPassword = async () => {
    console.log({ email, password });
    signInWithEmailAndPassword(auth, email, password)
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
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
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
        />
        <Pressable style={styles.button} onPress={signInWithPassword}>
          <Text style={styles.text}>Sign In</Text>
        </Pressable>
        <Button title='Create an account' onPress={() => navigation.navigate('SignUp')} />
      </ImageBackground>
    </SafeAreaView>
  );
}
