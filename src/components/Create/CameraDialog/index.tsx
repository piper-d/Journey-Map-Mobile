import Dialog from 'react-native-dialog';
import React from 'react';
import { MediaDisplay } from '../../custom/MediaDisplay';
import { useMedia } from '../../../hooks/useMedia';

export const CameraDialog = ({
  media,
  addMedia,
  removeMedia,
  isOpen,
  setIsOpen,
}: {
  media: string[] | undefined;
  addMedia: (x: string) => void;
  removeMedia: (x: string) => void;
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}) => {
  return (
    <Dialog.Container visible={isOpen}>
      <Dialog.Title>Add Media</Dialog.Title>
      <MediaDisplay media={media} addMedia={addMedia} removeMedia={removeMedia} type={'Camera'} />
      <Dialog.Button label={'Go back'} onPress={() => setIsOpen(false)} />
      {/* <Dialog.Button label={"Save"} onPress={() => setIsOpen(false) }/> */}
    </Dialog.Container>
  );
};
