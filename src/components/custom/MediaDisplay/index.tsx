import React from 'react';
import { FlatList, Image, View } from 'react-native';
import { AddMedia } from './AddMedia';
import { styles } from './styles';
import { ViewMedia } from './ViewMedia';

export const MediaDisplay = ({
  media,
  addMedia,
  removeMedia,
}: {
  media: string[] | undefined;
  addMedia: (mediaURL: string) => void;
  removeMedia: (mediaURL: string) => void;
}) => {
  const mediaLength = media ? media.length : 0;

  return (
    <View style={styles.container}>
      <FlatList
        horizontal={true}
        // addMedia component is included in list
        data={['addMedia', ...(media ?? [])]}
        renderItem={({ index, item }) => {
          if (index == 0) {
            return <AddMedia mediaLength={mediaLength} addMedia={addMedia} />;
          }

          return <ViewMedia uri={item} removeMedia={removeMedia} />;
        }}
        keyExtractor={(item) => item.toString()}
      />
    </View>
  );
};
