import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Tracking } from '../../components/Create';
import { styles } from './styles';

export function CreateView({ refreshArchive }: { refreshArchive: () => void }) {
  const [initialLocation, setInitialLocation] = useState<LocationObject>();
  const [trackingLocation, setTrackingLocation] = useState<LocationObject>();

  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isTrackingReady, setIsTrackingReady] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>();

  useEffect(() => {
    async function checkStatus() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      const isStatusGranted = status === 'granted' ? true : false;
      setStatus(isStatusGranted);

      if (!isStatusGranted) {
        alert('Permission to access location was denied');
        return;
      }
      const initLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      setInitialLocation(initLocation);
    }
    checkStatus();
  }, []);

  const startTracking = () => {
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    }).then((currLocation) => {
      setTrackingLocation(currLocation);
      setIsTrackingReady(true);
    });
  };

  useEffect(() => {
    if (isTrackingReady) {
      setIsTracking(true);
    }
  }, [isTrackingReady]);

  if (!status)
    return (
      <View>
        <Text>
          Permission to access location was denied. If you wish to use this feature change it in
          your settings.
        </Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {!isTracking && initialLocation && (
        <View>
          <MapView
            style={styles.map}
            showsUserLocation
            mapType='hybrid'
            provider={PROVIDER_GOOGLE}
            showsMyLocationButton
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
              onPress={() => startTracking()}
            >
              <MaterialCommunityIcons name='plus' size={48} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isTracking && (
        <Tracking
          initialLocation={trackingLocation!}
          setIsTracking={() => {
            setIsTracking(false);
            setIsTrackingReady(false);
          }}
          refreshArchive={refreshArchive}
        />
      )}
    </SafeAreaView>
  );
}
