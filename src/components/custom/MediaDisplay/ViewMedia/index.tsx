import React from 'react';
import { Image, View } from 'react-native';
import { styles } from './styles';

import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const ViewMedia = ({
  uri,
  removeMedia,
}: {
  uri: string;
  removeMedia: (mediaURL: string) => void;
}) => {
  return (
    <View>
      <Image
        style={styles.image}
        source={{
          uri,
        }}
      />
      <TouchableOpacity
        style={styles.deleteIcon}
        activeOpacity={0.7}
        onPress={() => removeMedia(uri)}
      >
        <MaterialCommunityIcons name='delete-outline' size={24} color={'grey'} />
      </TouchableOpacity>
    </View>
  );
};
