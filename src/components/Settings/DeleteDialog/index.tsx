import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmailAuthProvider, reauthenticateWithCredential, signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Dialog from 'react-native-dialog';
import { auth } from '../../../../config/firebase';
import { useUser } from '../../../api/useUser';
import { styles } from './styles';

export const DeleteDialog = ({
  isOpen,
  setIsOpen,
  setAuthorizedUser,
}: {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
  setAuthorizedUser: (x: boolean) => void;
}) => {
  //   const [isLoading, setIsLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { deleteUser } = useUser();

  const onDelete = () => {
    if (password !== undefined && password.length > 5) {
      const credential = EmailAuthProvider.credential(auth.currentUser!.email!, password);

      reauthenticateWithCredential(auth.currentUser!, credential)
        .then((userCred) => {
          console.log(userCred);
          signOut(auth)
            .then(() => {
              deleteUser()
                .then(async () => {
                  //   setIsLoading(false);
                  await AsyncStorage.clear();
                  setAuthorizedUser(false);
                  alert('Successfully deleted account');
                })
                .catch((x) => {
                  console.log('Error: account was not deleted');
                  setErrorMessage(x);
                });
            })
            .catch((error) => {
              console.log('Error: Sign out failed');
              console.log(error);
            });
        })
        .catch((error) => {
          console.log('Error: Reauth Failed');
          setErrorMessage(error.message);
        });
    } else {
      setErrorMessage('The Password is at least 6 characters long.');
    }
  };

  return (
    <View>
      <Dialog.Container visible={isOpen}>
        <Dialog.Title>Delete Account</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete your account? Once deleted all data will be deleted and
          cannot be retrieved. If you want to proceed enter you password below and click delete.
        </Dialog.Description>
        <Dialog.Input
          placeholder={'Password'}
          value={password}
          onChange={(e) => setPassword(e.nativeEvent.text)}
          secureTextEntry={false}
          autoCapitalize={'none'}
        />
        {!!errorMessage && (
          <View>
            <Text style={styles.error}>{errorMessage}</Text>
          </View>
        )}
        <Dialog.Button label='Cancel' onPress={() => setIsOpen(false)} />
        <Dialog.Button label='Delete' onPress={() => onDelete()} />
      </Dialog.Container>
    </View>
  );
};
