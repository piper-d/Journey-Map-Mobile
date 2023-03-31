import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import Dialog from 'react-native-dialog';
import { useTrips } from '../../../api/useTrips';
import { MediaDisplay } from '../../custom/MediaDisplay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';

export const ArchiveDialog = ({
  id,
  title,
  media,
  oldMedia,
  isOpen,
  addMedia,
  removeMedia,
  setIsOpen,
  setItems,
}: {
  id: string;
  title: string;
  media: string[] | undefined;
  oldMedia: string[] | undefined;
  isOpen: boolean;
  addMedia: (x: string) => void;
  removeMedia: (x: string) => void;
  setIsOpen: (x: boolean) => void;

  setItems: () => void;
}) => {
  const { updateTripTitle, addTripMedia, deleteTrip } = useTrips();

  const [newTitle, setNewTitle] = useState<string>('');
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const onSave = () => {
    if (newTitle.length > 0) {
      updateTripTitle(id, { title: newTitle }).then((x) => {
        setItems();
        setIsOpen(false);
      });
    }
    // for loop all trips
    const newMedia = media?.filter((item) => !oldMedia?.includes(item));
    const removeOldMedia = oldMedia?.filter((item) => !media?.includes(item));

    console.log('newMedia');
    console.log(newMedia);

    console.log('removeOldMedia');
    console.log(removeOldMedia);

    if (newMedia !== undefined && newMedia.length > 0) {
      for (var i = 0; i < newMedia.length; i++) {
        addTripMedia(id, { media: newMedia[i] }).then((x) => {});
      }
    }

    if (removeOldMedia !== undefined && removeOldMedia.length > 0) {
      //removeTripMedia
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

  const shareTrip = async () => {
    const url = '';

    const canShare = await Sharing.isAvailableAsync();

    if (canShare) {
      await Sharing.shareAsync(url, {});
    } else {
      Alert.alert('Sharing is not availble.');
    }
  };

  return (
    <View>
      {!isDelete && (
        <Dialog.Container visible={isOpen} contentStyle={styles.container}>
          <Dialog.Title>Edit Trip</Dialog.Title>
          <TouchableOpacity style={styles.deleteIcon} onPress={() => setIsDelete(true)}>
            <MaterialCommunityIcons name='delete-outline' color={'grey'} size={30} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareIcon} onPress={() => shareTrip()}>
            <MaterialCommunityIcons name='export-variant' color={'grey'} size={27} />
          </TouchableOpacity>
          <Dialog.Description>Change the title or add/remove media</Dialog.Description>
          <Dialog.Input
            placeholder={title}
            value={newTitle}
            onChange={(e) => setNewTitle(e.nativeEvent.text)}
          />
          <MediaDisplay
            media={media}
            addMedia={(x: string) => addMedia(x)}
            removeMedia={(x: string) => removeMedia(x)}
            type={'Library'}
          />

          <Dialog.Button label='Cancel' onPress={() => setIsOpen(false)} />
          <Dialog.Button label='Save' onPress={() => onSave()} />
        </Dialog.Container>
      )}
      {isDelete && (
        <Dialog.Container visible={isDelete}>
          <Dialog.Title>Delete Trip</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to delete this trip? This is permament and cannot be reversed
          </Dialog.Description>
          <Dialog.Button label='Go back' onPress={() => setIsDelete(false)} />
          <Dialog.Button label='Confirm' onPress={() => onDelete()} />
        </Dialog.Container>
      )}
    </View>
  );
};
