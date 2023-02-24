import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import React from 'react';
import { ImageBackground, Pressable, SafeAreaView, Text, View } from 'react-native';
import { auth } from '../../../config/firebase';
import { IUser } from '../../routes';
import { styles } from './styles';

export function SettingsView({ setAuthorizedUser }: Omit<IUser, 'authorizedUser'>) {
  const image = require('../../.././assets/topographic.png');

  function logoutUser() {
    signOut(auth)
      .then(async () => {
        // clear session storage
        await AsyncStorage.clear();
        setAuthorizedUser(false);
        alert('Logged Out Successfully');
      })
      .catch((error) => {
        alert(error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.image} source={image} resizeMode='cover'>
        <View style={styles.topButtonView}>
          <Pressable style={styles.button} onPress={() => {}}>
            <Text style={styles.text}>Change Username</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {}}>
            <Text style={styles.text}>Change Password</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {}}>
            <Text style={styles.text}>Enable Dark Mode</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {}}>
            <Text style={styles.text}>Switch to Metric</Text>
          </Pressable>
        </View>
        <View style={styles.bottomButtonView}>
          <Pressable style={styles.button} onPress={logoutUser}>
            <Text style={styles.text}>Sign Out</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
