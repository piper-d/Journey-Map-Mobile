import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Dialog from 'react-native-dialog';
import { useUser } from '../../../api/useUser';
import { Loader } from '../../custom/Loader';
import { styles } from './styles';

export const UsernameDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}) => {
  const [newUsername, setNewUsername] = useState<string>('');
  const [username, setUsername] = useState<string>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const { getUser, changeUsername } = useUser();

  useEffect(() => {
    if (isOpen) {
      getUser()
        .then((x) => {
          console.log(x);
          setUsername(x.username);
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    }
  }, [isOpen]);

  const onSave = () => {
    if (newUsername.length > 0) {
      setIsLoading(true);
      changeUsername({ username: newUsername }).then(() => {
        setIsLoading(false);
        setIsOpen(false);
      });
    } else {
      setErrorMessage('A new username must be entered');
    }
  };

  if (isLoading && username === undefined) return <Loader />;

  return (
    <View>
      <Dialog.Container visible={isOpen}>
        <Dialog.Title>Change Username</Dialog.Title>
        <Dialog.Input
          placeholder={username}
          value={newUsername}
          onChange={(e) => setNewUsername(e.nativeEvent.text)}
        />
        {!!errorMessage && (
          <View>
            <Text style={styles.error}>{errorMessage}</Text>
          </View>
        )}
        {isLoading && username !== undefined && <Loader color={'black'} style={{}} />}
        <Dialog.Button label='Cancel' onPress={() => setIsOpen(false)} />
        <Dialog.Button label='Save' onPress={() => onSave()} />
      </Dialog.Container>
    </View>
  );
};
