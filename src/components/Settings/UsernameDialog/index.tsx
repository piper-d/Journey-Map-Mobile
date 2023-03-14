import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Dialog from 'react-native-dialog';
import { useUser } from '../../../api/useUser';

export const UsernameDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}) => {
  const [newUsername, setNewUsername] = useState<string>('');

  const [username, setUsername] = useState<string>();

  const { getUser, changeUsername } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      changeUsername({ username: newUsername }).then(() => {
        setIsOpen(false);
      });
    }
  };

  if (isLoading && username === undefined)
    return (
      <View>
        <Text>LOADING</Text>
      </View>
    );

  return (
    <View>
      <Dialog.Container visible={isOpen}>
        <Dialog.Title>Change Username</Dialog.Title>
        <Dialog.Input
          placeholder={username}
          value={newUsername}
          onChange={(e) => setNewUsername(e.nativeEvent.text)}
        />
        <Dialog.Button label='Cancel' onPress={() => setIsOpen(false)} />
        <Dialog.Button label='Save' onPress={() => onSave()} />
      </Dialog.Container>
    </View>
  );
};
