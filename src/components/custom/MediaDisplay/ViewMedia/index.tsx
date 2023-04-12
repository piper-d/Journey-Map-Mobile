import React from 'react';
import { Image, View } from 'react-native';
import { styles } from './styles';

import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MediaObject } from '../../../../types/MediaTypes';

export const ViewMedia = ({
  media,
  removeMedia,
}: {
  media: MediaObject;
  removeMedia: (mediaURL: string) => void;
}) => {
  return (
    <View>
      <Image
        style={styles.image}
        source={{
          uri: media.url,
        }}
      />
      <TouchableOpacity
        style={styles.deleteIcon}
        activeOpacity={0.7}
        onPress={() => removeMedia(media.url)}
      >
        <MaterialCommunityIcons name='delete-outline' size={24} color={'grey'} />
      </TouchableOpacity>
    </View>
  );
};
