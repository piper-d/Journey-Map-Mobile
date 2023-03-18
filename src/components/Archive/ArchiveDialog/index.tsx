import React, { useMemo, useState } from 'react';
import { View, Image, Alert } from 'react-native';
import Dialog from 'react-native-dialog';
import { useTrips } from '../../../api/useTrips';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

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
  const [image, setImage] = useState<string>('');

  const { updateTripTitle, addTripMedia, deleteTrip } = useTrips();

  const onSave = () => {
    if (newTitle.length > 0) {
      updateTripTitle(id, { title: newTitle }).then((x) => {
        setItems();
        setIsOpen(false);
      });
    }

    if (image?.length > 0) {
      addTripMedia(id, { image: image }).then((x) => {});
    }
  };

  const onDelete = () => {
    deleteTrip(id)
      .then((x) => {
        setIsOpen(false);
        setItems();
      })
      .catch((error) => {
        console.log('error');
        console.log(error);
      });
  };

  const pickImage = async () => {
    const response = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (response.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } else {
      Alert.alert('The app needs permission to access the camera. Please change this in settings.');
    }
  };

  const shareTrip = async () => {
    const url = '';

    const canShare = await Sharing.isAvailableAsync();

    if (canShare) {
      await Sharing.shareAsync(url, {});
    } else {
      Alert.alert('Sharing is not availble.');
    }
  };
  // console.log(image);
  // console.log(!!image);

  const dialogStyles = useMemo(() => (!!image ? { width: 300, height: 500 } : {}), [image]);

  return (
    <View>
      <Dialog.Container visible={isOpen} verticalButtons={true} contentStyle={dialogStyles}>
        <Dialog.Title>Edit Trip</Dialog.Title>
        <Dialog.Description>Change the title or add/remove media</Dialog.Description>
        <Dialog.Input
          placeholder={title}
          value={newTitle}
          onChange={(e) => setNewTitle(e.nativeEvent.text)}
        />
        {image.length > 0 && <Image source={{ uri: image }} style={{ width: 100, height: 200 }} />}

        <Dialog.Button label='Share Trip' onPress={() => shareTrip()} />
        <Dialog.Button label='Add Media' onPress={() => pickImage()} />
        <Dialog.Button label='Delete Trip' onPress={() => onDelete()} />
        <Dialog.Button label='Cancel' onPress={() => setIsOpen(false)} />
        <Dialog.Button label='Save' onPress={() => onSave()} />
      </Dialog.Container>
    </View>
  );
};
