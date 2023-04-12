import React from 'react';
import { FlatList, View } from 'react-native';
import { AddMedia } from './AddMedia';
import { styles } from './styles';
import { ViewMedia } from './ViewMedia';
import { MediaObject } from '../../../types/MediaTypes';
import { LocationObject } from 'expo-location';
import { LatLng } from 'react-native-maps';

export type CameraType = 'Camera' | 'Library';

export const MediaDisplay = ({
  media,
  addMedia,
  removeMedia,
  type,
  currLocation,
  randomCoord,
}: {
  media: MediaObject[] | undefined;
  addMedia: (mediaURL: MediaObject) => void;
  removeMedia: (mediaURL: string) => void;
  type: CameraType;
  currLocation?: LocationObject;
  randomCoord?: LatLng;
}) => {
  const mediaLength = media ? media.length : 0;

  // used for AddMedia component
  const fakeMedia: MediaObject = {
    url: 'addMedia',
    latitude: '1',
    longitude: '1',
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal={true}
        // addMedia component is included in list
        data={[fakeMedia, ...(media ?? [])]}
        renderItem={({ index, item }) => {
          if (index == 0) {
            return (
              <AddMedia
                mediaLength={mediaLength}
                addMedia={addMedia}
                type={type}
                currLocation={currLocation}
                randomCoord={randomCoord}
              />
            );
          }

          return <ViewMedia media={item as unknown as MediaObject} removeMedia={removeMedia} />;
        }}
        keyExtractor={(item) => item.url.toString()}
      />
    </View>
  );
};
