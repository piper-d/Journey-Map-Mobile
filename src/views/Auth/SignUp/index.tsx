import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Button, ImageBackground, Pressable, SafeAreaView, Text, TextInput } from 'react-native';
import { auth, db } from '../../../../config/firebase';
import { IUser, StackProps } from '../../../routes';
import { styles } from './styles';

export function SignUp({
  route,
  navigation,
  setAuthorizedUser,
}: Omit<IUser, 'authorizedUser'> & StackProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const image = require('../../../.././assets/topographic.png');

  const signUpWithPassword = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        let tkn = await user.getIdToken();
        // set access token in session storage
        AsyncStorage.setItem('accessToken', tkn);
        setAuthorizedUser(true);
        console.log(user);
        await setDoc(doc(db, 'Users', user.uid), { username: username, email: email, Trips: [] });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.image} source={image} resizeMode='cover'>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={(value) => setUsername(value)}
          placeholder='Username'
          placeholderTextColor={'black'}
          autoCapitalize='none'
        />
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
        <Pressable style={styles.button} onPress={signUpWithPassword}>
          <Text style={styles.text}>Create an Account</Text>
        </Pressable>
        <Button title='Sign in' onPress={() => navigation.navigate('SignIn')} />
      </ImageBackground>
    </SafeAreaView>
  );
}
