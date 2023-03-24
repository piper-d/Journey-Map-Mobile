import React from 'react';
import { FlatList, View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  requestMediaLibraryPermissionsAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from 'expo-image-picker';

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

  const pickImage = async () => {
    const response = await requestMediaLibraryPermissionsAsync();

    if (response.granted) {
      let result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        addMedia(result.assets![0].uri);
      }
    } else {
      Alert.alert('The app needs permission to access the camera. Please change this in settings.');
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.add} activeOpacity={0.7} onPress={() => pickImage()}>
        <View style={styles.imageLength}>
          <Text style={{ color: 'grey' }}>{mediaLength}</Text>
        </View>
        <MaterialCommunityIcons name='plus' size={48} color={'grey'} />
      </TouchableOpacity>
      <FlatList
        contentContainerStyle={styles.imageContainer}
        data={media}
        renderItem={({ index }) => <Image source={{ uri: media![index] }} />}
        keyExtractor={(item) => item.toString()}
      />
    </View>
  );
};
