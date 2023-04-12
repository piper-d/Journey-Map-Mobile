import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import Dialog from 'react-native-dialog';
import { useTrips } from '../../../api/useTrips';
import { MediaDisplay } from '../../custom/MediaDisplay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import { Loader } from '../../custom/Loader';
import { documentDirectory, downloadAsync } from 'expo-file-system';
import { MediaObject } from '../../../types/MediaTypes';

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
  media: MediaObject[] | undefined;
  oldMedia: MediaObject[] | undefined;
  isOpen: boolean;
  addMedia: (x: MediaObject) => void;
  removeMedia: (x: string) => void;
  setIsOpen: (x: boolean) => void;
  setItems: () => void;
}) => {
  const { updateTripTitle, addTripMedia, deleteTrip, exportTrip, deleteTripMedia } = useTrips();

  const [newTitle, setNewTitle] = useState<string>('');
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSave = async () => {
    setIsLoading(true);

    if (newTitle.length > 0) {
      await updateTripTitle(id, { title: newTitle });
    }

    // Find what needs to be added and deleted
    const newMedia = media?.filter((item) => !oldMedia?.includes(item));
    const removeOldMedia = oldMedia?.filter((item) => !media?.includes(item));

    // Add new images
    if (newMedia !== undefined && newMedia.length > 0) {
      for (var i = 0; i < newMedia.length; i++) {
        await addTripMedia(id, newMedia[i]);
      }
    }

    // Remove deleted Images
    if (removeOldMedia !== undefined && removeOldMedia.length > 0) {
      for (var i = 0; i < removeOldMedia.length; i++) {
        await deleteTripMedia(id, removeOldMedia[i]);
      }
    }
    setItems();
    setIsLoading(false);
    setIsOpen(false);
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

  const shareTrip = () => {
    setIsLoading(true);
    exportTrip(id).then(async (uri) => {
      const canShare = await Sharing.isAvailableAsync();

      // console.log(url);
      if (canShare) {
        downloadAsync(uri, documentDirectory + `${id}.mp4`).then(async ({ uri: localUrl }) => {
          Sharing.shareAsync(localUrl).then(() => {
            setIsLoading(false);
          });
        });
      } else {
        Alert.alert('Sharing is not availble.');
      }
    });
  };

  const isMedia =
    media !== undefined && media.length > 0 && oldMedia !== undefined && oldMedia.length > 0;

  return (
    <View>
      {!isDelete && (
        <Dialog.Container visible={isOpen} contentStyle={styles.container}>
          <Dialog.Title>Edit Trip</Dialog.Title>
          <TouchableOpacity
            disabled={isLoading}
            style={styles.deleteIcon}
            onPress={() => setIsDelete(true)}
          >
            <MaterialCommunityIcons name='delete-outline' color={'grey'} size={30} />
          </TouchableOpacity>
          {isMedia && (
            <TouchableOpacity
              style={styles.shareIcon}
              onPress={() => shareTrip()}
              disabled={isLoading}
            >
              <MaterialCommunityIcons name='export-variant' color={'grey'} size={27} />
            </TouchableOpacity>
          )}
          <Dialog.Description>Change the title or add/remove media</Dialog.Description>
          <Dialog.Input
            editable={!isLoading}
            placeholder={title}
            value={newTitle}
            onChange={(e) => setNewTitle(e.nativeEvent.text)}
          />
          {isLoading && <Loader color={'grey'} style={{ paddingBottom: 15 }} />}
          {!isLoading && (
            <MediaDisplay
              media={media}
              addMedia={(x: MediaObject) => addMedia(x)}
              removeMedia={(x: string) => removeMedia(x)}
              type={'Library'}
            />
          )}

          <Dialog.Button disabled={isLoading} label='Cancel' onPress={() => setIsOpen(false)} />
          <Dialog.Button disabled={isLoading} label='Save' onPress={() => onSave()} />
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
