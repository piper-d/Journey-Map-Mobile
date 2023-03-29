import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Button, ImageBackground, Pressable, Text, TextInput, View } from 'react-native';
import { auth, db } from '../../../../config/firebase';
import { IUser, StackProps } from '../../../routes';
import { styles } from './styles';

export function SignUp({
  route,
  navigation,
  setAuthorizedUser,
}: Omit<IUser, 'authorizedUser'> & StackProps) {
  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const image = require('../../../.././assets/topographic.png');

  const signUpWithPassword = async () => {
    // if (username !== undefined && username?.length > 0) {
    createUserWithEmailAndPassword(auth, email!, password!)
      .then(async (userCredential) => {
        const user = userCredential.user;

        if (user) {
          let tkn = await user.getIdToken();
          // set access token in session storage
          AsyncStorage.setItem('accessToken', tkn);
          setAuthorizedUser(true);
          console.log(user);
          await setDoc(doc(db, 'Users', user.uid), {
            username: username,
            email: email,
            Trips: [],
          });
        }
      })
      .catch((error) => {
        setErrorMessage(getErrorMessgages(error.message, username, email, password));
      });
    // }
  };

  return (
    <View style={styles.container}>
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
          secureTextEntry={true}
        />
        <Text style={styles.error}>{errorMessage}</Text>
        <Pressable style={styles.button} onPress={signUpWithPassword}>
          <Text style={styles.text}>Create an Account</Text>
        </Pressable>
        <Button title='Sign in' onPress={() => navigation.navigate('SignIn')} />
      </ImageBackground>
    </View>
  );
}

const getErrorMessgages = (
  error: string | undefined,
  username: string | undefined,
  email: string | undefined,
  password: string | undefined
) => {
  console.log(error);
  if (error === undefined) return error;

  if (username === undefined || username.length === 0) {
    return 'There was no username provided, please enter one';
  } else if (email === undefined || email.length === 0) {
    return 'There was no email provded, please enter one';
  } else if (password === undefined || password.length === 0) {
    return 'There was no password provded, please enter one';
  }

  if (error.includes('missing-email')) {
    return 'There was no email provided, please enter one';
  } else if (error.includes('missing-password') || password === undefined) {
    return 'There was no password provided, please enter one';
  } else if (error.includes('invalid-email')) {
    return 'The email entered is not a valid address, please try again';
  } else if (error.includes('wrong-password')) {
    return 'The password entered was incorrect, please try again';
  } else if (error.includes('email-already-in-use')) {
    return 'This email is already in use. Try another or sign in';
  } else if (error.includes('weak-password')) {
    return 'This password is weak. It should be at least 6 characters';
  }

  return error;
};
