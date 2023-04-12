import React from 'react';
import Dialog from 'react-native-dialog';
import { MediaDisplay } from '../../custom/MediaDisplay';
import { MediaObject } from '../../../types/MediaTypes';
import { LocationObject } from 'expo-location';

export const CameraDialog = ({
  media,
  addMedia,
  removeMedia,
  isOpen,
  setIsOpen,
  currLocation,
}: {
  media: MediaObject[] | undefined;
  addMedia: (x: MediaObject) => void;
  removeMedia: (x: string) => void;
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
  currLocation?: LocationObject;
}) => {
  return (
    <Dialog.Container visible={isOpen}>
      <Dialog.Title>Add Media</Dialog.Title>
      <MediaDisplay
        media={media}
        addMedia={addMedia}
        removeMedia={removeMedia}
        type={'Camera'}
        currLocation={currLocation}
      />
      <Dialog.Button label={'Go back'} onPress={() => setIsOpen(false)} />
      {/* <Dialog.Button label={"Save"} onPress={() => setIsOpen(false) }/> */}
    </Dialog.Container>
  );
};
