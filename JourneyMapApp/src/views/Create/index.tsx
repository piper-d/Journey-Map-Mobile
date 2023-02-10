import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Tracking } from '../../components/Create/Tracking';
import { styles } from './styles';
import { TabProps } from '../../routes';

export function CreateView({ route, navigation }: TabProps) {
  const [initialLocation, setInitialLocation] = useState<LocationObject>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isTracking, setIsTracking] = useState<boolean>(false);

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
      <MapView
        style={styles.map}
        showsUserLocation
        mapType='hybrid'
        showsScale
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton
        region={{
          latitude: initialLocation?.coords?.latitude!,
          longitude: initialLocation?.coords?.longitude!,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
      />
      <Button title='Track' onPress={() => setIsTracking(true)}></Button>

      {isTracking && (
        <Tracking initialLocation={initialLocation!} setIsTracking={() => setIsTracking(false)} />
      )}
    </SafeAreaView>
  );
}
