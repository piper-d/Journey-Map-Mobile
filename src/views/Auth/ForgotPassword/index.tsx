import React, { useState } from 'react';
import { Button, ImageBackground, Pressable, Text, TextInput, View } from 'react-native';
import { StackProps } from '../../../routes';
import { styles } from './styles';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../../config/firebase';

export const ForgotPassword = ({ route, navigation }: StackProps) => {
  const image = require('../../../.././assets/topographic.png');

  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>();

  const resetPassword = async () => {
    if (email.length > 0) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert(
            'Assuming that the email address provided is valid, the password reset email has been configured. Please give it a few minutes to be delivered.'
          );
          //   navigation.navigate('SignIn');
        })
        .catch(() => {
          //   console.log(error);
          setErrorMessage('The email entered was not valid. Please enter a valid one.');
        });
    } else {
      setErrorMessage('There was no email provided. Please enter one.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.image} source={image} resizeMode='cover'>
        <Text style={styles.textInfo}>
          If you can't remember your password, simply enter your email below to receive a reset
          email.
        </Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(value) => setEmail(value)}
          placeholder='Email'
          placeholderTextColor={'black'}
          autoCapitalize='none'
        />

        <Text style={styles.error}>{errorMessage}</Text>
        <Pressable style={styles.button} onPress={resetPassword}>
          <Text style={styles.text}>Send Email</Text>
        </Pressable>
        <Button title='Sign in' onPress={() => navigation.navigate('SignIn')} />
      </ImageBackground>
    </View>
  );
};

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
