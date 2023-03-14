import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ImageBackground, Pressable, SafeAreaView, Text, View } from 'react-native';
import { auth } from '../../../config/firebase';
import { IUser } from '../../routes';
import { styles } from './styles';
import { useUser } from '../../api/useUser';
import { UsernameDialog } from '../../components/Settings/UsernameDialog';
import { PasswordDialog } from '../../components/Settings/PasswordDialog';

export function SettingsView({ setAuthorizedUser }: Omit<IUser, 'authorizedUser'>) {
  const image = require('../../.././assets/topographic.png');

  const [isUsernameOpen, setIsUsernameOpen] = useState<boolean>(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState<boolean>(false);

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
    <>
      {isUsernameOpen && (
        <UsernameDialog isOpen={isUsernameOpen} setIsOpen={(x) => setIsUsernameOpen(x)} />
      )}
      {isPasswordOpen && (
        <PasswordDialog isOpen={isPasswordOpen} setIsOpen={(x) => setIsPasswordOpen(x)} />
      )}

      <SafeAreaView style={styles.container}>
        <ImageBackground style={styles.image} source={image} resizeMode='cover'>
          <View style={styles.topButtonView}>
            <Pressable style={styles.button} onPress={() => setIsUsernameOpen(true)}>
              <Text style={styles.text}>Change Username</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => setIsPasswordOpen(true)}>
              <Text style={styles.text}>Change Password</Text>
            </Pressable>
            {/* <Pressable style={styles.button} onPress={() => {}}>
            <Text style={styles.text}>Enable Dark Mode</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => {}}>
            <Text style={styles.text}>Switch to Metric</Text>
          </Pressable> */}
          </View>
          <View style={styles.bottomButtonView}>
            <Pressable style={styles.button} onPress={logoutUser}>
              <Text style={styles.text}>Sign Out</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
}
