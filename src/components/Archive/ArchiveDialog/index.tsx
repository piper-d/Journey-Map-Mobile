import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import Dialog from 'react-native-dialog';
import { useTrips } from '../../../api/useTrips';
import { MediaDisplay } from '../../custom/MediaDisplay';

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
  const [media, setMedia] = useState<string[]>();

  const { updateTripTitle, addTripMedia, deleteTrip } = useTrips();

  const addMedia = (mediaUrl: string) => {
    setMedia((prevMedia) => {
      if (prevMedia === undefined) {
        return [mediaUrl];
      }
      return [...prevMedia, mediaUrl];
    });
  };

  const removeMedia = (mediaUrl: string) => {
    setMedia((prevMedia) => {
      return prevMedia?.filter((x) => x !== mediaUrl);
    });
  };

  const onSave = () => {
    if (newTitle.length > 0) {
      updateTripTitle(id, { title: newTitle }).then((x) => {
        setItems();
        setIsOpen(false);
      });
    }
    // for loop all trips
    if (media !== undefined && media[0]?.length > 0) {
      addTripMedia(id, { media: media[0] }).then((x) => {});
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
  // console.log(image);
  // console.log(!!image);

  // const dialogStyles = useMemo(() => (media ? { width: 330, height: 560 } : {}), [media]);

  return (
    <View>
      <Dialog.Container
        visible={isOpen}
        verticalButtons={true}
        contentStyle={{ width: 330, height: 560 }}
      >
        <Dialog.Title>Edit Trip</Dialog.Title>
        <Dialog.Description>Change the title or add/remove media</Dialog.Description>
        <Dialog.Input
          placeholder={title}
          value={newTitle}
          onChange={(e) => setNewTitle(e.nativeEvent.text)}
        />
        {/* {image.length > 0 && <Image source={{ uri: image }} style={{ width: 100, height: 200 }} />} */}
        <MediaDisplay
          media={media}
          addMedia={(x: string) => addMedia(x)}
          removeMedia={(x: string) => removeMedia(x)}
        />

        <Dialog.Button label='Share Trip' onPress={() => shareTrip()} />
        <Dialog.Button label='Add Media' onPress={() => pickImage()} />
        <Dialog.Button label='Delete Trip' onPress={() => onDelete()} />
        <Dialog.Button label='Cancel' onPress={() => setIsOpen(false)} />
        <Dialog.Button label='Save' onPress={() => onSave()} />
      </Dialog.Container>
    </View>
  );
};
