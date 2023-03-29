import {
  MediaTypeOptions,
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';

export const AddMedia = ({
  mediaLength,
  addMedia,
}: {
  mediaLength: number;
  addMedia: (mediaURL: string) => void;
}) => {
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
    <TouchableOpacity style={styles.add} activeOpacity={0.7} onPress={() => pickImage()}>
      <View style={styles.imageLength}>
        <Text style={{ color: 'grey' }}>{mediaLength}</Text>
      </View>
      <MaterialCommunityIcons name='plus' size={48} color={'grey'} />
    </TouchableOpacity>
  );
};
