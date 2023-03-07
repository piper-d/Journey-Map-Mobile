import React, { useState } from 'react';
import { View } from 'react-native';
import Dialog from 'react-native-dialog';
import { useTrips } from '../../../api/useTrips';

export const ArchiveDialog = ({
  id,
  title,
  isOpen,
  setIsOpen,
  setItems,
}: {
  id: string;
  title: string;
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
  setItems: () => void;
}) => {
  const [newTitle, setNewTitle] = useState<string>('');

  const { updateTripTitle } = useTrips();

  const onSave = () => {
    if (newTitle.length > 0) {
      updateTripTitle(id, { title: newTitle }).then((x) => {
        console.log('Successs');
        console.log(x);
        setItems();
        setIsOpen(false);
      });
    }
  };

  return (
    <View>
      <Dialog.Container visible={isOpen}>
        <Dialog.Title>Edit Trip</Dialog.Title>
        <Dialog.Description>Change the title or add/remove media</Dialog.Description>
        <Dialog.Input
          placeholder={title}
          value={newTitle}
          onChange={(e) => setNewTitle(e.nativeEvent.text)}
        />
        <Dialog.Button label='Cancel' onPress={() => setIsOpen(false)} />
        <Dialog.Button label='Save' onPress={() => onSave()} />
      </Dialog.Container>
    </View>
  );
};
