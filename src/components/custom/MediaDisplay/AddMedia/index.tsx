import {
  MediaTypeOptions,
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
  requestCameraPermissionsAsync,
  launchCameraAsync,
} from 'expo-image-picker';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import { CameraType } from '..';
import { MediaObject } from '../../../../types/MediaTypes';
import { LocationObject } from 'expo-location';

export const AddMedia = ({
  mediaLength,
  addMedia,
  type,
  currLocation,
}: {
  mediaLength: number;
  addMedia: (mediaURL: MediaObject) => void;
  type: CameraType;
  currLocation?: LocationObject;
}) => {
  const pickLibrary = async () => {
    const response = await requestMediaLibraryPermissionsAsync();

    if (response.granted) {
      let result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        addMedia({ url: result.assets![0].uri, latitude: '69', longitude: '69' });
      }
    } else {
      Alert.alert('The app needs permission to access the camera. Please change this in settings.');
    }
  };

  const pickCamera = async () => {
    const response = await requestCameraPermissionsAsync();
    if (response.granted) {
      let result = await launchCameraAsync({
        mediaTypes: MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      if (!result.canceled) {
        const { latitude, longitude } = currLocation?.coords!;

        addMedia({
          url: result.assets![0].uri,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        });
      }
    } else {
      Alert.alert('The app needs permission to access the camera. Please change this in settings.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.add}
      activeOpacity={0.7}
      onPress={() => (type === 'Camera' ? pickCamera() : pickLibrary())}
    >
      <View style={styles.imageLength}>
        <Text style={{ color: 'grey' }}>{mediaLength}</Text>
      </View>
      <MaterialCommunityIcons name='plus' size={48} color={'grey'} />
    </TouchableOpacity>
  );
};
