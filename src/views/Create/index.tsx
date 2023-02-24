import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Button, Pressable, SafeAreaView, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Tracking } from '../../components/Create/Tracking';
import { styles } from './styles';
import { TabProps } from '../../routes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function CreateView({ route, navigation }: TabProps) {
  const [initialLocation, setInitialLocation] = useState<LocationObject>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkStatus() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      const initLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setInitialLocation(initLocation);
    }
    checkStatus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {!isTracking && (
        <>
          <MapView
            style={styles.map}
            showsUserLocation
            mapType='hybrid'
            showsScale
            provider={PROVIDER_GOOGLE}
            showsMyLocationButton
            onMapLoaded={() => setIsLoading(false)}
            region={{
              latitude: initialLocation?.coords?.latitude!,
              longitude: initialLocation?.coords?.longitude!,
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            }}
          />
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.9}
              onPress={() => setIsTracking(true)}
              disabled={isLoading}
            >
              <MaterialCommunityIcons name='plus' size={48} />
            </TouchableOpacity>
          </View>
        </>
      )}

      {isTracking && (
        <Tracking initialLocation={initialLocation!} setIsTracking={() => setIsTracking(false)} />
      )}
    </SafeAreaView>
  );
}