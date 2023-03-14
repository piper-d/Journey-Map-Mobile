import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Dialog from 'react-native-dialog';
import { auth } from '../../../../config/firebase';
import { styles } from './styles';

export const PasswordDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}) => {
  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const onSave = async () => {
    if (newPassword !== undefined && oldPassword !== undefined && newPassword.length > 5) {
      const credential = EmailAuthProvider.credential(auth.currentUser!.email!, oldPassword);
      reauthenticateWithCredential(auth.currentUser!, credential)
        .then((userCred) => {
          console.log(userCred);
          updatePassword(userCred.user, newPassword)
            .then((x) => {
              console.log('WORKED');
              console.log(x);
              setIsOpen(false);
            })
            .catch((error) => {
              console.log('Error 3');
              console.log(error.message);
            });
        })
        .catch((error) => {
          console.log('Error 2');
          setErrorMessage(error.message);
        });
    } else {
      console.log('Error 1');
      setErrorMessage('Password must be at least 6 characters');
    }
  };

  return (
    <View>
      <Dialog.Container visible={isOpen}>
        <Dialog.Title>Change Password</Dialog.Title>
        <Dialog.Input
          placeholder={'Old Password'}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.nativeEvent.text)}
          secureTextEntry={false}
          autoCapitalize={'none'}
        />
        <Dialog.Input
          placeholder={'New Password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.nativeEvent.text)}
          secureTextEntry={false}
          autoCapitalize={'none'}
        />
        {!!errorMessage && (
          <View>
            <Text style={styles.error}>{errorMessage}</Text>
          </View>
        )}
        <Dialog.Button label='Cancel' onPress={() => setIsOpen(false)} />
        <Dialog.Button label='Save' onPress={() => onSave()} />
      </Dialog.Container>
    </View>
  );
};
